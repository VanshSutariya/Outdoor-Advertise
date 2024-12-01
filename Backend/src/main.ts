// import { NestFactory } from '@nestjs/core';
// import { AppModule } from './app.module';
// import { ValidationPipe } from '@nestjs/common';
// import { CorsOptions } from '@nestjs/common/interfaces/external/cors-options.interface';
// import helmet from 'helmet';

// async function createNestApp() {
//   const app = await NestFactory.create(AppModule, {
//     rawBody: true,
//     cors: true,
//   });
//   app.use(helmet());
//   app.useGlobalPipes(new ValidationPipe());

//   const corsOptions: CorsOptions = {
//     origin: 'http://localhost:3000',
//     methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
//   };
//   app.enableCors(corsOptions);

//   await app.listen(4000)
// }
// createNestApp()

import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import helmet from 'helmet';
import { ValidationPipe } from '@nestjs/common';

let cachedApp;

export async function handler(event, context) {
  if (!cachedApp) {
    const app = await NestFactory.create(AppModule);
    app.use(helmet());
    app.useGlobalPipes(new ValidationPipe());
    app.enableCors({
      origin: 'http://localhost:3000',
      methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
    });
    await app.init();
    cachedApp = app.getHttpAdapter().getInstance();
  }

  return cachedApp(event, context);
}
