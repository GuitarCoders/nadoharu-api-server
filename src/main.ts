import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { install } from 'source-map-support'
install();

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    cors: {
      origin: "*",
      methods: ["GET", "PUT", "POST", "DELETE"]
    }
  });
  await app.listen(6378);
}
bootstrap();
