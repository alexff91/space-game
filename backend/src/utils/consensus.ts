import { Annotation, Image } from '../models';
import { Op } from 'sequelize';

interface ClusterPoint {
  x: number;
  y: number;
  category: string;
  annotations: any[];
}

/**
 * Calculate consensus annotations for an image
 * Groups similar annotations and identifies areas of agreement
 */
export async function calculateConsensus(imageId: number): Promise<void> {
  try {
    // Get all annotations for the image
    const annotations = await Annotation.findAll({
      where: { imageId },
    });

    if (annotations.length < 3) {
      // Need at least 3 annotations for consensus
      return;
    }

    // Group annotations by category
    const categorized: { [key: string]: any[] } = {};

    annotations.forEach((annotation) => {
      if (!categorized[annotation.category]) {
        categorized[annotation.category] = [];
      }
      categorized[annotation.category].push(annotation);
    });

    const consensusAnnotations: any[] = [];

    // For each category, find clusters of similar annotations
    for (const [category, categoryAnnotations] of Object.entries(categorized)) {
      if (categoryAnnotations.length < 2) {
        continue;
      }

      // Simple clustering based on proximity
      const clusters = clusterAnnotations(categoryAnnotations);

      // Convert clusters to consensus annotations
      clusters.forEach((cluster) => {
        if (cluster.annotations.length >= 2) {
          // At least 2 users agree
          consensusAnnotations.push({
            category: cluster.category,
            coordinates: {
              x: cluster.x,
              y: cluster.y,
            },
            agreementCount: cluster.annotations.length,
            confidence: calculateConfidence(cluster.annotations),
            userIds: cluster.annotations.map((a) => a.userId),
          });
        }
      });
    }

    // Update image with consensus annotations
    const image = await Image.findByPk(imageId);
    if (image) {
      await image.update({
        consensusAnnotations,
      });

      // Update consensus scores for individual annotations
      for (const consensus of consensusAnnotations) {
        for (const userId of consensus.userIds) {
          await Annotation.update(
            { consensusScore: consensus.agreementCount },
            {
              where: {
                imageId,
                userId,
                category: consensus.category,
              },
            }
          );
        }
      }
    }
  } catch (error) {
    console.error('Error calculating consensus:', error);
    throw error;
  }
}

/**
 * Cluster annotations based on spatial proximity
 */
function clusterAnnotations(annotations: any[]): ClusterPoint[] {
  const clusters: ClusterPoint[] = [];
  const processed = new Set<number>();

  annotations.forEach((annotation, index) => {
    if (processed.has(index)) {
      return;
    }

    const center = getAnnotationCenter(annotation.coordinates);
    if (!center) {
      return;
    }

    const cluster: ClusterPoint = {
      x: center.x,
      y: center.y,
      category: annotation.category,
      annotations: [annotation],
    };

    // Find nearby annotations
    annotations.forEach((other, otherIndex) => {
      if (index === otherIndex || processed.has(otherIndex)) {
        return;
      }

      const otherCenter = getAnnotationCenter(other.coordinates);
      if (!otherCenter) {
        return;
      }

      const distance = Math.sqrt(
        Math.pow(center.x - otherCenter.x, 2) + Math.pow(center.y - otherCenter.y, 2)
      );

      // If within 50 pixels (adjust threshold as needed)
      if (distance < 50) {
        cluster.annotations.push(other);
        processed.add(otherIndex);
      }
    });

    processed.add(index);
    clusters.push(cluster);
  });

  return clusters;
}

/**
 * Get center point of an annotation
 */
function getAnnotationCenter(coordinates: any): { x: number; y: number } | null {
  try {
    if (coordinates.x !== undefined && coordinates.y !== undefined) {
      // Point annotation
      return { x: coordinates.x, y: coordinates.y };
    } else if (coordinates.x1 !== undefined && coordinates.y1 !== undefined) {
      // Rectangle annotation
      return {
        x: (coordinates.x1 + (coordinates.x2 || coordinates.x1)) / 2,
        y: (coordinates.y1 + (coordinates.y2 || coordinates.y1)) / 2,
      };
    } else if (Array.isArray(coordinates.points) && coordinates.points.length > 0) {
      // Polygon/freeform annotation
      const avgX =
        coordinates.points.reduce((sum: number, p: any) => sum + p.x, 0) /
        coordinates.points.length;
      const avgY =
        coordinates.points.reduce((sum: number, p: any) => sum + p.y, 0) /
        coordinates.points.length;
      return { x: avgX, y: avgY };
    }
  } catch (error) {
    console.error('Error getting annotation center:', error);
  }
  return null;
}

/**
 * Calculate confidence based on user annotations
 */
function calculateConfidence(annotations: any[]): number {
  if (annotations.length === 0) {
    return 0;
  }

  const avgConfidence =
    annotations.reduce((sum, a) => sum + (a.confidence || 3), 0) / annotations.length;

  // Weight by number of annotations
  const countWeight = Math.min(annotations.length / 5, 1); // Max weight at 5 annotations

  return Math.round(avgConfidence * countWeight * 20) / 20; // Round to nearest 0.05
}
