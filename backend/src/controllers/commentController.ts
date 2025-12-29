import { Request, Response } from 'express';
import { Comment, User } from '../models';
import { AuthRequest } from '../middleware/auth';

// @desc    Get comments for an image
// @route   GET /api/comments/image/:imageId
// @access  Public
export const getImageComments = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const comments = await Comment.findAll({
      where: {
        imageId: req.params.imageId,
        isDeleted: false,
      },
      include: [
        {
          model: User,
          as: 'user',
          attributes: ['id', 'username', 'level', 'avatarUrl'],
        },
      ],
      order: [['createdAt', 'DESC']],
    });

    res.status(200).json({
      success: true,
      data: comments,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message || 'Error fetching comments',
    });
  }
};

// @desc    Create comment
// @route   POST /api/comments
// @access  Private
export const createComment = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const { imageId, content } = req.body;

    if (!content || content.trim().length === 0) {
      res.status(400).json({
        success: false,
        message: 'Comment content is required',
      });
      return;
    }

    const comment = await Comment.create({
      userId: req.user.id,
      imageId,
      content: content.trim(),
    });

    // Load user data
    const commentWithUser = await Comment.findByPk(comment.id, {
      include: [
        {
          model: User,
          as: 'user',
          attributes: ['id', 'username', 'level', 'avatarUrl'],
        },
      ],
    });

    res.status(201).json({
      success: true,
      data: commentWithUser,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message || 'Error creating comment',
    });
  }
};

// @desc    Like comment
// @route   POST /api/comments/:id/like
// @access  Private
export const likeComment = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const comment = await Comment.findByPk(req.params.id);

    if (!comment) {
      res.status(404).json({
        success: false,
        message: 'Comment not found',
      });
      return;
    }

    await comment.increment('likes');

    res.status(200).json({
      success: true,
      data: comment,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message || 'Error liking comment',
    });
  }
};

// @desc    Delete comment
// @route   DELETE /api/comments/:id
// @access  Private
export const deleteComment = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const comment = await Comment.findByPk(req.params.id);

    if (!comment) {
      res.status(404).json({
        success: false,
        message: 'Comment not found',
      });
      return;
    }

    // Check if user owns the comment or is admin
    if (comment.userId !== req.user.id && req.user.role !== 'admin') {
      res.status(403).json({
        success: false,
        message: 'Not authorized to delete this comment',
      });
      return;
    }

    await comment.update({ isDeleted: true });

    res.status(200).json({
      success: true,
      message: 'Comment deleted',
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message || 'Error deleting comment',
    });
  }
};
