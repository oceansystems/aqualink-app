import { UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import * as path from 'path';
import { validateMimetype } from './mimetypes';
import { fileFilter } from './file.filter';
import { CustomGoogleCloudStorage } from './custom-google-cloud.storage';

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
  // Detach config object from MulterConfigurationOptions because
  // param acl is not currently documented in the types file of the extension 'multer-google-storage'
  // although the functionality for access control exists
  const config: any = {
    bucket: process.env.GCS_BUCKET,
    keyFilename: process.env.GCS_KEYFILE,
    projectId: process.env.GC_PROJECT,
    autoRetry: true,
    maxRetries: 3,
    filename: assignName(
      path.join(process.env.STORAGE_FOLDER || '', subfolder),
      prefix,
    ),
    acl: 'publicread',
  };

  return UseInterceptors(
    FileInterceptor(param, {
      storage: new CustomGoogleCloudStorage(config),
      fileFilter: fileFilter(acceptTypes),
    }),
  );
};
