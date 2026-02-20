import { useState, useRef } from 'react';
import { Stage, Layer, Image as KonvaImage, Rect, Circle } from 'react-konva';
import { Image as ImageType, Annotation, AnnotationCoordinates } from '@/types';
import { ANNOTATION_CATEGORIES, ANNOTATION_TOOLS } from '@/utils/constants';
import { ZoomIn, ZoomOut, Move, Maximize2 } from 'lucide-react';
import useImage from 'use-image';

interface ImageViewerProps {
  image: ImageType;
  onAnnotate?: (annotation: {
    type: string;
    coordinates: AnnotationCoordinates;
    category: string;
  }) => void;
  annotations?: Annotation[];
  readOnly?: boolean;
}

export default function ImageViewer({
  image,
  onAnnotate,
  annotations = [],
  readOnly = false,
}: ImageViewerProps) {
  const [selectedTool, setSelectedTool] = useState<string>('point');
  const [selectedCategory, setSelectedCategory] = useState<string>('galaxy');
  const [scale, setScale] = useState(1);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDrawing, setIsDrawing] = useState(false);
  const [currentShape, setCurrentShape] = useState<any>(null);
  const [loadedImage] = useImage(image.imageUrl, 'anonymous');
  const stageRef = useRef<any>(null);

  const containerWidth = 1000;
  const containerHeight = 700;

  const handleWheel = (e: any) => {
    e.evt.preventDefault();

    const scaleBy = 1.1;
    const stage = e.target.getStage();
    const oldScale = stage.scaleX();
    const pointer = stage.getPointerPosition();

    const mousePointTo = {
      x: (pointer.x - stage.x()) / oldScale,
      y: (pointer.y - stage.y()) / oldScale,
    };

    const newScale = e.evt.deltaY < 0 ? oldScale * scaleBy : oldScale / scaleBy;

    setScale(Math.max(0.5, Math.min(5, newScale)));

    const newPos = {
      x: pointer.x - mousePointTo.x * newScale,
      y: pointer.y - mousePointTo.y * newScale,
    };

    setPosition(newPos);
  };

  const handleMouseDown = (e: any) => {
    if (readOnly) return;

    const pos = e.target.getStage().getPointerPosition();
    const relativePos = {
      x: (pos.x - position.x) / scale,
      y: (pos.y - position.y) / scale,
    };

    setIsDrawing(true);

    if (selectedTool === 'point') {
      // Create point annotation immediately
      if (onAnnotate) {
        onAnnotate({
          type: 'point',
          coordinates: { x: relativePos.x, y: relativePos.y },
          category: selectedCategory,
        });
      }
      setIsDrawing(false);
    } else if (selectedTool === 'rectangle') {
      setCurrentShape({
        x: relativePos.x,
        y: relativePos.y,
        width: 0,
        height: 0,
      });
    }
  };

  const handleMouseMove = (e: any) => {
    if (!isDrawing || selectedTool === 'point') return;

    const pos = e.target.getStage().getPointerPosition();
    const relativePos = {
      x: (pos.x - position.x) / scale,
      y: (pos.y - position.y) / scale,
    };

    if (selectedTool === 'rectangle' && currentShape) {
      setCurrentShape({
        ...currentShape,
        width: relativePos.x - currentShape.x,
        height: relativePos.y - currentShape.y,
      });
    }
  };

  const handleMouseUp = () => {
    if (!isDrawing) return;

    setIsDrawing(false);

    if (selectedTool === 'rectangle' && currentShape && onAnnotate) {
      onAnnotate({
        type: 'rectangle',
        coordinates: {
          x1: currentShape.x,
          y1: currentShape.y,
          x2: currentShape.x + currentShape.width,
          y2: currentShape.y + currentShape.height,
        },
        category: selectedCategory,
      });
    }

    setCurrentShape(null);
  };

  const handleZoomIn = () => setScale(Math.min(5, scale * 1.2));
  const handleZoomOut = () => setScale(Math.max(0.5, scale / 1.2));
  const handleReset = () => {
    setScale(1);
    setPosition({ x: 0, y: 0 });
  };

  const getCategoryColor = (category: string) => {
    const cat = ANNOTATION_CATEGORIES.find((c) => c.id === category);
    return cat?.color || '#3B82F6';
  };

  return (
    <div className="space-y-4">
      {/* Tools */}
      {!readOnly && (
        <div className="card">
          <h3 className="text-lg font-semibold mb-4">Annotation Tools</h3>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">Tool</label>
              <div className="grid grid-cols-2 gap-2">
                {ANNOTATION_TOOLS.slice(0, 2).map((tool) => (
                  <button
                    key={tool.id}
                    onClick={() => setSelectedTool(tool.id)}
                    className={`p-3 rounded-lg border-2 transition-all ${
                      selectedTool === tool.id
                        ? 'border-primary-500 bg-primary-900/30'
                        : 'border-gray-600 hover:border-gray-500'
                    }`}
                  >
                    <div className="text-2xl mb-1">{tool.icon}</div>
                    <div className="text-xs">{tool.name}</div>
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Category</label>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="input-field"
              >
                {ANNOTATION_CATEGORIES.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
      )}

      {/* Viewer Controls */}
      <div className="flex items-center justify-between bg-space-blue p-3 rounded-lg">
        <div className="flex items-center space-x-2">
          <button onClick={handleZoomOut} className="p-2 hover:bg-space-purple rounded">
            <ZoomOut className="w-5 h-5" />
          </button>
          <span className="text-sm px-3">{Math.round(scale * 100)}%</span>
          <button onClick={handleZoomIn} className="p-2 hover:bg-space-purple rounded">
            <ZoomIn className="w-5 h-5" />
          </button>
          <button onClick={handleReset} className="p-2 hover:bg-space-purple rounded ml-2">
            <Maximize2 className="w-5 h-5" />
          </button>
        </div>
        <div className="text-sm text-gray-400">
          <Move className="w-4 h-4 inline mr-1" />
          Scroll to zoom, drag to pan
        </div>
      </div>

      {/* Canvas */}
      <div className="bg-space-darker rounded-lg overflow-hidden border border-primary-900/20">
        <Stage
          ref={stageRef}
          width={containerWidth}
          height={containerHeight}
          scaleX={scale}
          scaleY={scale}
          x={position.x}
          y={position.y}
          draggable={!isDrawing}
          onWheel={handleWheel}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onTouchStart={handleMouseDown}
          onTouchMove={handleMouseMove}
          onTouchEnd={handleMouseUp}
        >
          <Layer>
            {loadedImage && (
              <KonvaImage
                image={loadedImage}
                width={loadedImage.width}
                height={loadedImage.height}
              />
            )}

            {/* Render existing annotations */}
            {annotations.map((ann, i) => {
              const color = getCategoryColor(ann.category);

              if (ann.type === 'point' && ann.coordinates.x && ann.coordinates.y) {
                return (
                  <Circle
                    key={i}
                    x={ann.coordinates.x}
                    y={ann.coordinates.y}
                    radius={8}
                    stroke={color}
                    strokeWidth={3}
                    fill="transparent"
                  />
                );
              } else if (
                ann.type === 'rectangle' &&
                ann.coordinates.x1 &&
                ann.coordinates.y1 &&
                ann.coordinates.x2 &&
                ann.coordinates.y2
              ) {
                return (
                  <Rect
                    key={i}
                    x={ann.coordinates.x1}
                    y={ann.coordinates.y1}
                    width={ann.coordinates.x2 - ann.coordinates.x1}
                    height={ann.coordinates.y2 - ann.coordinates.y1}
                    stroke={color}
                    strokeWidth={3}
                    fill="transparent"
                  />
                );
              }
              return null;
            })}

            {/* Render current shape being drawn */}
            {currentShape && selectedTool === 'rectangle' && (
              <Rect
                x={currentShape.x}
                y={currentShape.y}
                width={currentShape.width}
                height={currentShape.height}
                stroke={getCategoryColor(selectedCategory)}
                strokeWidth={3}
                fill="transparent"
                dash={[5, 5]}
              />
            )}
          </Layer>
        </Stage>
      </div>

      {/* Legend */}
      <div className="card">
        <h4 className="font-semibold mb-3">Annotations ({annotations.length})</h4>
        <div className="grid grid-cols-3 gap-2">
          {ANNOTATION_CATEGORIES.map((cat) => {
            const count = annotations.filter((a) => a.category === cat.id).length;
            if (count === 0) return null;

            return (
              <div
                key={cat.id}
                className="flex items-center space-x-2 text-sm"
              >
                <div
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: cat.color }}
                />
                <span>
                  {cat.name}: {count}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
