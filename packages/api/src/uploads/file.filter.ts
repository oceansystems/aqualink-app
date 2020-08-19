import { BadRequestException } from '@nestjs/common';
import { validateMimetype } from './mimetypes';

export function fileFilter(validTypes: string[]) {
  return (
    req: any,
    file: Express.Multer.File,
    callback: (error: Error | null, acceptFile: boolean) => void,
  ): void => {
    const type = validateMimetype(file.mimetype);
    const isValid = validTypes.findIndex((t) => t === type) !== -1;
    if (!isValid) {
      return callback(
        new BadRequestException(`Invalid file type ${file.mimetype}.`),
        false,
      );
    }
    return callback(null, true);
  };
}
