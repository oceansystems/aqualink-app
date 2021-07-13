import { InternalServerErrorException } from '@nestjs/common';

const { GCS_BUCKET } = process.env;

export const getFileFromURL = (url: string) => {
  if (!GCS_BUCKET) {
    throw new InternalServerErrorException('GCS_BUCKET variable is not set');
  }

  return url.split(`${GCS_BUCKET}/`)[1];
};
