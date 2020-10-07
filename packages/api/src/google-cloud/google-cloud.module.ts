import { Module } from '@nestjs/common';
import { GoogleCloudService } from './google-cloud.service';

@Module({
  providers: [GoogleCloudService],
  exports: [GoogleCloudService],
})
export class GoogleCloudModule {}
