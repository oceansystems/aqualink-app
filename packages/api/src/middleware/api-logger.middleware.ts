import { Logger } from '@nestjs/common';

export const apiLoggerMiddleware = (req, res, next) => {
  const logger = new Logger('ApiLogger');
  const start = new Date().getTime();
  res.on('close', () => {
    const end = new Date().getTime();
    logger.warn(
      `${req.method} ${req.url} - ${res.statusCode} ${end - start}ms`,
    );
  });
  next();
};
