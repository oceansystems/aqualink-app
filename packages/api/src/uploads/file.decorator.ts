import { UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { Request } from 'express';
import MulterGoogleCloudStorage from 'multer-google-storage';
import * as path from 'path';
import { random, times } from 'lodash';
import { validateMimetype } from './mimetypes';
import { fileFilter } from './file.filter';

export const getRandomName = (
  folder: string,
  prefix: string,
  file: string,
  type: string | undefined,
) => {
  const extension = path.extname(file);
  const randomString = times(16, () => random(15).toString(16)).join('');
  const fullname = `${prefix}-${type}-${randomString}${extension}`;
  return path.join(folder, fullname);
};

export function assignName(folder: string, prefix: string) {
  return (
    req: Request,
    file: Express.Multer.File,
    callback: (error: Error | null, filename: string) => void,
  ) => {
    const type = validateMimetype(file.mimetype);
    const relativePath = getRandomName(folder, prefix, file.originalname, type);
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
      storage: new MulterGoogleCloudStorage(config),
      fileFilter: fileFilter(acceptTypes),
      limits: {
        fileSize: maxFileSizeB,
      },
    }),
  );
};
