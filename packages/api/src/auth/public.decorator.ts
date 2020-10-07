import { applyDecorators, SetMetadata } from '@nestjs/common';

export const Public = () => {
  return applyDecorators(SetMetadata('isPublic', true));
};
