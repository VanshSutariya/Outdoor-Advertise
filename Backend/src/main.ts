import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { CorsOptions } from '@nestjs/common/interfaces/external/cors-options.interface';
import helmet from 'helmet';
import { VercelRequest, VercelResponse } from '@vercel/node';

let appInstance = null;

async function createNestApp() {
  if (!appInstance) {
    const app = await NestFactory.create(AppModule, {
      rawBody: true,
      cors: true,
    });
    app.use(helmet());
    app.useGlobalPipes(new ValidationPipe());

    const corsOptions: CorsOptions = {
      origin: 'http://localhost:3000',
      methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
    };
    app.enableCors(corsOptions);

    await app.init(); // Initialize the app instead of listening
    appInstance = app.getHttpAdapter().getInstance();
  }
  return appInstance;
}

// This is the handler Vercel will use
export default async function handler(req: VercelRequest, res: VercelResponse) {
  const app = await createNestApp();
  app(req, res); // Pass the request and response to the NestJS app
}
