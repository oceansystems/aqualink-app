import {
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { Storage } from '@google-cloud/storage';

@Injectable()
export class GoogleCloudService {
  private logger = new Logger('GCS');
  private storage: Storage;

  constructor() {
    this.storage = new Storage({
      autoRetry: true,
      keyFilename: process.env.GCS_KEYFILE,
      projectId: process.env.GCS_PROJECT,
      maxRetries: 3,
    });
  }

  public async deleteFile(file: string) {
    if (!process.env.GCS_BUCKET) {
      this.logger.error('GCS_BUCKET variable has not been initialized');
      throw new InternalServerErrorException();
    }

    try {
      await this.storage.bucket(process.env.GCS_BUCKET).file(file).delete();
    } catch (error) {
      this.logger.error(`Failed to delete the file ${file}: `, error);
      throw new InternalServerErrorException();
    }
  }
}
