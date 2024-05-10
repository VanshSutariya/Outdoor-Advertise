import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { CorsOptions } from '@nestjs/common/interfaces/external/cors-options.interface';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    rawBody: true,
    cors: true,
  });
  app.useGlobalPipes(new ValidationPipe());
  const corsOptions: CorsOptions = {
    origin: 'http://localhost:3000', // Replace with your frontend URL
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'], // Include PATCH method
  };

  app.enableCors(corsOptions);

  await app.listen(4000);
}
bootstrap();
