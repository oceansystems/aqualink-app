import {
  Catch,
  UnauthorizedException,
  ExceptionFilter,
  ArgumentsHost,
  Logger,
} from '@nestjs/common';

@Catch(UnauthorizedException)
export class UnauthorizedExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(UnauthorizedExceptionFilter.name);
  catch(exception: UnauthorizedException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();
    const status = exception.getStatus();

    this.logger.error(
      `An error has occurred: ${exception.message}`,
      exception.stack,
    );

    response.status(status).json({
      statusCode: status,
      message: 'You are not allowed to execute this operation.',
    });
  }
}
