import {
  Controller,
  Get,
  Post,
  UploadedFile,
  UseInterceptors,
  Query,
  UseGuards,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiTags, ApiOperation, ApiConsumes, ApiBody, ApiQuery } from '@nestjs/swagger';
import { StorageService } from './storage.service';

@ApiTags('Cloud Media Storage (Cloudinary)')
@Controller('storage')
export class StorageController {
  constructor(private readonly storageService: StorageService) {}

  @Get('signature')
  @ApiOperation({ summary: 'Get Cloudinary client-side upload signature & presets for direct video/image upload' })
  @ApiQuery({ name: 'folder', required: false, example: 'nursing_college/students' })
  getSignature(@Query('folder') folder?: string) {
    return this.storageService.getUploadSignature(folder || 'nursing_college/uploads');
  }

  @Post('upload')
  @ApiOperation({ summary: 'Upload single image, video, or document to Cloudinary' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  })
  @UseInterceptors(FileInterceptor('file'))
  async uploadFile(
    @UploadedFile() file: any,
    @Query('folder') folder?: string,
  ) {

    if (!file) {
      return { error: 'No file provided in multipart payload' };
    }

    return this.storageService.saveFile(
      file.buffer,
      file.originalname,
      file.mimetype,
      folder || 'nursemanagement',
    );
  }
}
