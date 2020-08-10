import { NestFactory } from '@nestjs/core';
import { useContainer } from 'class-validator';
import * as admin from 'firebase-admin';
import { AppModule } from './app.module';
import { GlobalValidationPipe } from './validations/global-validation.pipe';

const serviceAccount = require('../firebase');

async function bootstrap() {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  });
  const app = await NestFactory.create(AppModule);
  app.enableCors();
  app.useGlobalPipes(
    new GlobalValidationPipe({ transform: true, skipTransformIds: ['hashId'] }),
  );
  // eslint-disable-next-line react-hooks/rules-of-hooks
  useContainer(app.select(AppModule), { fallbackOnErrors: true });
  await app.listen(8080);
  // eslint-disable-next-line no-console
  console.log(`App listening on port 8080`);
}
bootstrap();
