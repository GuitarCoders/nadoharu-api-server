import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { install } from 'source-map-support'
install();

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors();
  await app.listen(6378);
}
bootstrap();
