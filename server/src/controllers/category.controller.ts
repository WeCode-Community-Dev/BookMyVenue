import { Request, Response, NextFunction } from 'express';
import * as categoryService from '@/services/category.service';
import success from '@/utils/response';
import { HTTP_STATUS } from '@/constants/http';
import { uploadToCloudinary } from '@/libs/cloudinary';
import fs from 'fs/promises';

// CREATE
export const createCategory = async (req: Request, res: Response, next: NextFunction) => {
  let tempFilePath = req.file?.path;
  try {
    const { name, description } = req.body;

    if (!name || typeof name !== 'string') {
      throw new Error('Name is required');
    }

    if (!req.file) {
      throw new Error('Category image is required');
    }

    const maxSizeBytes = 2 * 1024 * 1024; // 2MB
    if (req.file.size > maxSizeBytes) {
      throw new Error('Image size must be less than 2MB');
    }

    let image_public_id, imageUrl;

    if (tempFilePath) {
      const image = await categoryService.uploadCategoryImage(tempFilePath);
      imageUrl = image.imageUrl;
      image_public_id = image.image_public_id;
    }

    const category = await categoryService.createCategory({
      name,
      description,
      imageUrl,
      image_public_id,
    });

    return success(res, HTTP_STATUS.CREATED, category, 'New Category created');
  } catch (error) {
    next(error);
  } finally {
    if (tempFilePath) {
      await fs.unlink(tempFilePath).catch(() => {});
    }
    tempFilePath = undefined;
  }
};

// UPDATE
export const updateCategory = async (req: Request, res: Response, next: NextFunction) => {
  let tempFilePath = req.file?.path;
  try {
    const { name, description } = req.body;

    if (req.file) {
      const maxSizeBytes = 2 * 1024 * 1024; // 2MB
      if (req.file.size > maxSizeBytes) {
        throw new Error('Image size must be less than 2MB');
      }
    }

    let image_public_id, imageUrl;

    if (tempFilePath) {
      const image = await categoryService.uploadCategoryImage(
        tempFilePath,
        req.params.id as string
      );
      imageUrl = image.imageUrl;
      image_public_id = image.image_public_id;
    }

    const category = await categoryService.updateCategory({
      id: req.params.id as string,
      name,
      description,
      imageUrl,
      image_public_id,
    });

    return success(res, HTTP_STATUS.OK, category, 'Category updated');
  } catch (error) {
    next(error);
  } finally {
    if (tempFilePath) {
      await fs.unlink(tempFilePath).catch(() => {});
    }
    tempFilePath = undefined;
  }
};

export const deleteCategory = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const category = await categoryService.deleteCategory(req.params.id as string);

    return success(res, HTTP_STATUS.OK, category, 'Category deleted');
  } catch (error) {
    next(error);
  }
};

// RESTORE
export const restoreCategory = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const category = await categoryService.restoreCategory(req.params.id as string);

    return success(res, HTTP_STATUS.OK, category, 'Category restored');
  } catch (error) {
    next(error);
  }
};

// SINGLE GET
export const getCategory = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const category = await categoryService.getCategory(req.params.id as string);

    return success(res, HTTP_STATUS.OK, category, 'Category fetched');
  } catch (error) {
    next(error);
  }
};

export const getCategories = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const categories = await categoryService.getCategories(req.query);

    return success(res, HTTP_STATUS.OK, categories, 'Categories fetched');
  } catch (error) {
    next(error);
  }
};
