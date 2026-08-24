import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { v2 as cloudinary, UploadApiResponse } from 'cloudinary';
import * as fs from 'fs/promises';
import * as path from 'path';
import { v4 as uuidv4 } from 'uuid';

export interface UploadedFileResult {
  filename: string;
  originalName: string;
  mimeType: string;
  size: number;
  url: string;
  publicId?: string;
  resourceType?: 'image' | 'video' | 'raw' | 'auto';
  format?: string;
}

@Injectable()
export class StorageService {
  private readonly logger = new Logger(StorageService.name);
  private readonly uploadDir: string;
  private isCloudinaryConfigured = false;

  constructor(private readonly config: ConfigService) {
    this.uploadDir = path.resolve(process.cwd(), 'uploads');
    this.ensureUploadDir();
    this.initCloudinary();
  }

  private initCloudinary() {
    const cloudName = process.env.CLOUDINARY_CLOUD_NAME || this.config.get<string>('CLOUDINARY_CLOUD_NAME');
    const apiKey = process.env.CLOUDINARY_API_KEY || this.config.get<string>('CLOUDINARY_API_KEY');
    const apiSecret = process.env.CLOUDINARY_API_SECRET || this.config.get<string>('CLOUDINARY_API_SECRET');

    if (cloudName && apiKey && apiSecret) {
      cloudinary.config({
        cloud_name: cloudName,
        api_key: apiKey,
        api_secret: apiSecret,
        secure: true,
      });
      this.isCloudinaryConfigured = true;
      this.logger.log(`☁️ Cloudinary initialized successfully with cloud: ${cloudName}`);
    } else {
      this.logger.warn('Cloudinary credentials not detected; defaulting to local filesystem storage.');
    }
  }

  private async ensureUploadDir() {
    try {
      await fs.mkdir(this.uploadDir, { recursive: true });
    } catch (err: any) {
      this.logger.error(`Failed to create upload directory: ${err?.message}`);
    }
  }

  /**
   * Upload file to Cloudinary with automatic resource_type (image/video/raw) detection,
   * falling back to local storage if Cloudinary is not configured.
   */
  async saveFile(
    buffer: Buffer,
    originalName: string,
    mimeType: string,
    subfolder = 'nursemanagement',
  ): Promise<UploadedFileResult> {
    if (this.isCloudinaryConfigured) {
      try {
        let resourceType: 'image' | 'video' | 'raw' | 'auto' = 'auto';
        if (mimeType.startsWith('image/')) resourceType = 'image';
        else if (mimeType.startsWith('video/')) resourceType = 'video';
        else resourceType = 'raw';

        const uploadResult = await new Promise<UploadApiResponse>((resolve, reject) => {
          const uploadStream = cloudinary.uploader.upload_stream(
            {
              folder: `nursing_college/${subfolder}`,
              resource_type: resourceType,
              use_filename: true,
              unique_filename: true,
              upload_preset: process.env.CLOUDINARY_UPLOAD_PRESET || undefined,
            },
            (error, result) => {
              if (error) return reject(error);
              if (result) return resolve(result);
              reject(new Error('Cloudinary upload returned empty response'));
            },
          );
          uploadStream.end(buffer);
        });

        return {
          filename: `${uploadResult.public_id}.${uploadResult.format || 'bin'}`,
          originalName,
          mimeType,
          size: uploadResult.bytes || buffer.length,
          url: uploadResult.secure_url,
          publicId: uploadResult.public_id,
          resourceType: uploadResult.resource_type as any,
          format: uploadResult.format,
        };
      } catch (cloudErr: any) {
        this.logger.warn(`Cloudinary upload failed (${cloudErr?.message}). Falling back to local storage...`);
      }
    }

    // Local Disk Storage Fallback
    const ext = path.extname(originalName) || '.bin';
    const filename = `${uuidv4()}${ext}`;
    const targetFolder = path.join(this.uploadDir, subfolder);
    await fs.mkdir(targetFolder, { recursive: true });

    const filePath = path.join(targetFolder, filename);
    await fs.writeFile(filePath, buffer);

    const relativeUrl = `/uploads/${subfolder}/${filename}`;
    return {
      filename,
      originalName,
      mimeType,
      size: buffer.length,
      url: relativeUrl,
      resourceType: mimeType.startsWith('video/') ? 'video' : mimeType.startsWith('image/') ? 'image' : 'raw',
    };
  }

  /**
   * Delete file from Cloudinary or local disk
   */
  async deleteFile(fileUrlOrPublicId: string): Promise<boolean> {
    if (this.isCloudinaryConfigured && !fileUrlOrPublicId.startsWith('/uploads/')) {
      try {
        const res = await cloudinary.uploader.destroy(fileUrlOrPublicId);
        return res.result === 'ok';
      } catch (err: any) {
        this.logger.warn(`Cloudinary delete failed for ${fileUrlOrPublicId}: ${err?.message}`);
      }
    }

    try {
      const sanitizedPath = path.join(process.cwd(), fileUrlOrPublicId.replace(/^\//, ''));
      await fs.unlink(sanitizedPath);
      return true;
    } catch {
      return false;
    }
  }

  /**
   * Generate signed Cloudinary upload params for direct frontend client uploads
   */
  getUploadSignature(folder = 'nursing_college/uploads') {
    if (!this.isCloudinaryConfigured) return null;
    const timestamp = Math.round(new Date().getTime() / 1000);
    const signature = cloudinary.utils.api_sign_request(
      { timestamp, folder },
      process.env.CLOUDINARY_API_SECRET || '',
    );

    return {
      timestamp,
      folder,
      signature,
      apiKey: process.env.CLOUDINARY_API_KEY,
      cloudName: process.env.CLOUDINARY_CLOUD_NAME,
      uploadPreset: process.env.CLOUDINARY_UPLOAD_PRESET || 'nursemanagement',
    };
  }
}

