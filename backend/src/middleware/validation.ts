import { Request, Response, NextFunction } from 'express';
import Joi from 'joi';

export const validate = (schema: Joi.ObjectSchema) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    const { error } = schema.validate(req.body, { abortEarly: false });

    if (error) {
      const errors = error.details.map((detail) => ({
        field: detail.path.join('.'),
        message: detail.message,
      }));

      res.status(400).json({
        success: false,
        message: 'Validation error',
        errors,
      });
      return;
    }

    next();
  };
};

// Validation schemas
export const registerSchema = Joi.object({
  username: Joi.string().alphanum().min(3).max(50).required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(6).max(255).required(),
});

export const loginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required(),
});

export const annotationSchema = Joi.object({
  imageId: Joi.number().integer().positive().required(),
  type: Joi.string().valid('point', 'rectangle', 'polygon', 'freeform').required(),
  coordinates: Joi.object().required(),
  category: Joi.string().max(100).required(),
  confidence: Joi.number().integer().min(1).max(5).optional(),
  description: Joi.string().max(1000).optional(),
});

export const updateUserSchema = Joi.object({
  username: Joi.string().alphanum().min(3).max(50).optional(),
  email: Joi.string().email().optional(),
  avatarUrl: Joi.string().uri().optional(),
  preferences: Joi.object().optional(),
});
