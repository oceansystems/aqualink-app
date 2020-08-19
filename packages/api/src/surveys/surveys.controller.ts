import { Controller, Post, UploadedFile } from '@nestjs/common';
import { AcceptFile } from '../uploads/file.decorator';
import { Auth } from '../auth/auth.decorator';
import { AdminLevel } from '../users/users.entity';

@Controller('surveys')
export class SurveysController {
  @Auth(AdminLevel.ReefManager, AdminLevel.SuperAdmin)
  @Post('upload')
  @AcceptFile('file', ['image', 'video'], 'surveys', 'reef')
  upload(@UploadedFile('file') file: any): Promise<string> {
    return file.path;
  }
}
