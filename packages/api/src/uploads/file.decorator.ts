import { UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import MulterGoogleCloudStorage from 'multer-google-storage';
import * as path from 'path';
import { validateMimetype } from './mimetypes';
import { fileFilter } from './file.filter';

export function assignName(folder: string, prefix: string) {
  return (
    req: any,
    file: Express.Multer.File,
    callback: (error: Error | null, filename: string) => void,
  ) => {
    const extension = path.extname(file.originalname);
    const type = validateMimetype(file.mimetype);
    const randomString = Array(16)
      .fill(null)
      .map(() => Math.round(Math.random() * 15).toString(16))
      .join('');
    const fullname = `${prefix}-${type}-${randomString}${extension}`;
    const relativePath = path.join(folder, fullname);
    return callback(null, relativePath);
  };
}

export const AcceptFile = (
  param: string,
  acceptTypes: string[],
  subfolder: string,
  prefix: string,
) => {
  const maxFileSizeMB = process.env.STORAGE_MAX_FILE_SIZE_MB
    ? parseInt(process.env.STORAGE_MAX_FILE_SIZE_MB, 10)
    : 1;
  const maxFileSizeB = maxFileSizeMB * 1024 * 1024;
  return UseInterceptors(
    FileInterceptor(param, {
      storage: new MulterGoogleCloudStorage({
        bucket: process.env.GCS_BUCKET,
        keyFilename: process.env.GCS_KEYFILE,
        projectId: process.env.GC_PROJECT,
        autoRetry: true,
        maxRetries: 3,
        filename: assignName(
          path.join(process.env.STORAGE_FOLDER || '', subfolder),
          prefix,
        ),
      }),
      fileFilter: fileFilter(acceptTypes),
      limits: {
        fileSize: maxFileSizeB,
      },
    }),
  );
};
