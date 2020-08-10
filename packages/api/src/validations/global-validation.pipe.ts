import {
  ValidationPipe,
  ArgumentMetadata,
  Injectable,
  ValidationPipeOptions,
} from '@nestjs/common';

type CustomOptions = {
  // Param ids to skip auto transformation for
  skipTransformIds?: string[];
};

/**
 * Custom Validation pipe that extends the options available for the global validation pipe. This is needed to allow
 * for things like overriding auto transforms.
 */
@Injectable()
export class GlobalValidationPipe extends ValidationPipe {
  skipTransformIds: string[];

  constructor(options?: ValidationPipeOptions & CustomOptions) {
    super(options);
    this.skipTransformIds = (options && options.skipTransformIds) || [];
  }

  async transform(value: any, metadata: ArgumentMetadata) {
    const originalTransform = this.isTransformEnabled;

    // Check if we should skip transforms for this param
    if (
      metadata &&
      metadata.type === 'param' &&
      metadata.data &&
      this.skipTransformIds.includes(metadata.data)
    ) {
      this.isTransformEnabled = false;
    }

    try {
      return super.transform(value, metadata);
    } finally {
      this.isTransformEnabled = originalTransform;
    }
  }
}
