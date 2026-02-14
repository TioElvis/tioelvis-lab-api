import {
  FastifyAdapter,
  NestFastifyApplication,
} from '@nestjs/platform-fastify';
import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';

import { AppModule } from './app.module';

const methods = ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'];

async function bootstrap() {
  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    new FastifyAdapter(),
  );

  app.enableCors({
    methods,
    origin: (origin, callback) => {
      const isProduction = process.env.NODE_ENV === 'production';

      const allowedOrigins = [
        `https://${process.env.DOMAIN}`,
        `https://www.${process.env.DOMAIN}`,
      ];

      if (!origin) return callback(null, true);

      if (!isProduction || allowedOrigins.includes(origin)) {
        return callback(null, true);
      }

      return callback(new Error('Not allowed by CORS'), false);
    },
  });
  app.useGlobalPipes(new ValidationPipe({ transform: true }));

  await app.listen(process.env.PORT ?? 9000, '0.0.0.0');
}

void bootstrap();
