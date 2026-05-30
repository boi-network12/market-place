// middleware/uploadMiddleware.ts
import multer from 'multer';
import { Request } from 'express';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';

// Configure multer for memory storage (we'll upload directly to Cloudinary)
const storage = multer.memoryStorage();

// File filter for images only
const fileFilter = (req: Request, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
  const allowedMimes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif'];
  
  if (allowedMimes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Invalid file type. Only JPEG, PNG, WEBP, and GIF are allowed.') as any, false);
  }
};

// Create multer upload instance
export const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
    files: 1, // Max 1 file per request
  },
});

// Cloudinary configuration
import { v2 as cloudinary } from 'cloudinary';

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
});

export interface CloudinaryUploadResult {
  public_id: string;
  version: number;
  signature: string;
  width: number;
  height: number;
  format: string;
  resource_type: string;
  created_at: string;
  tags: string[];
  bytes: number;
  type: string;
  etag: string;
  placeholder: boolean;
  url: string;
  secure_url: string;
  original_filename: string;
}

export class UploadService {
  /**
   * Upload profile avatar to Cloudinary
   */
  static async uploadAvatar(
    fileBuffer: Buffer,
    userId: string,
    originalFilename: string
  ): Promise<CloudinaryUploadResult> {
    return new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          folder: `users/${userId}/avatar`,
          public_id: `avatar_${uuidv4()}`,
          overwrite: true,
          transformation: [
            { width: 500, height: 500, crop: 'limit', quality: 'auto:good' },
          ],
          tags: ['avatar', 'profile'],
          context: {
            alt: `User ${userId} avatar`,
            uploaded_by: userId,
          },
        },
        (error, result) => {
          if (error) reject(error);
          else resolve(result as CloudinaryUploadResult);
        }
      );
      
      uploadStream.end(fileBuffer);
    });
  }
  
  /**
   * Upload product image (for future use)
   */
  static async uploadProductImage(
    fileBuffer: Buffer,
    sellerId: string,
    productId: string,
    index: number
  ): Promise<CloudinaryUploadResult> {
    return new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          folder: `sellers/${sellerId}/products/${productId}`,
          public_id: `image_${index + 1}`,
          transformation: [
            { width: 1200, height: 1200, crop: 'limit', quality: 'auto:good' },
          ],
          tags: ['product', `seller_${sellerId}`],
        },
        (error, result) => {
          if (error) reject(error);
          else resolve(result as CloudinaryUploadResult);
        }
      );
      
      uploadStream.end(fileBuffer);
    });
  }
  
  /**
   * Delete image from Cloudinary
   */
  static async deleteImage(publicId: string): Promise<boolean> {
    try {
      const result = await cloudinary.uploader.destroy(publicId);
      return result.result === 'ok';
    } catch (error) {
      console.error('Cloudinary delete error:', error);
      return false;
    }
  }
  
  /**
   * Get optimized URL with transformations
   */
  static getOptimizedUrl(publicId: string, options?: {
    width?: number;
    height?: number;
    crop?: string;
    quality?: string;
    format?: string;
  }): string {
    const transformation: string[] = [];
    
    if (options?.width) transformation.push(`w_${options.width}`);
    if (options?.height) transformation.push(`h_${options.height}`);
    if (options?.crop) transformation.push(`c_${options.crop}`);
    if (options?.quality) transformation.push(`q_${options.quality}`);
    if (options?.format) transformation.push(`f_${options.format}`);
    
    const transformationString = transformation.length > 0 ? `${transformation.join(',')}/` : '';
    return cloudinary.url(publicId, {
      secure: true,
      transformation: transformationString,
    });
  }
}

export default cloudinary;