import { InternalServerErrorException } from '@nestjs/common';

const { GCS_BUCKET } = process.env;

export const getFileFromURL = (url: string) => {
  if (!GCS_BUCKET) {
    throw new InternalServerErrorException('GCS_BUCKET variable is not set');
  }
  // We need to grab the path/to/file. So we split the url on "{GCS_BUCKET}/"
  return url.split(`${GCS_BUCKET}/`)[1];
};
