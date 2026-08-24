import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as fs from 'fs/promises';
import * as path from 'path';
import { v4 as uuidv4 } from 'uuid';

export interface UploadedFileResult {
  filename: string;
  originalName: string;
  mimeType: string;
  size: number;
  url: string;
}

@Injectable()
export class StorageService {
  private readonly logger = new Logger(StorageService.name);
  private readonly uploadDir: string;

  constructor(private readonly config: ConfigService) {
    this.uploadDir = path.resolve(process.cwd(), 'uploads');
    this.ensureUploadDir();
  }

  private async ensureUploadDir() {
    try {
      await fs.mkdir(this.uploadDir, { recursive: true });
    } catch (err: any) {
      this.logger.error(`Failed to create upload directory: ${err?.message}`);
    }
  }

  async saveFile(
    buffer: Buffer,
    originalName: string,
    mimeType: string,
    subfolder = 'documents',
  ): Promise<UploadedFileResult> {
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
    };
  }

  async deleteFile(fileUrl: string): Promise<boolean> {
    try {
      const sanitizedPath = path.join(process.cwd(), fileUrl.replace(/^\//, ''));
      await fs.unlink(sanitizedPath);
      return true;
    } catch {
      return false;
    }
  }
}
