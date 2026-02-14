import {
  FastifyAdapter,
  NestFastifyApplication,
} from '@nestjs/platform-fastify';
import { NestFactory } from '@nestjs/core';

import { AppModule } from './app.module';

const methods = ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'];

async function bootstrap() {
  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    new FastifyAdapter(),
  );

  // CONFIG
  app.enableCors({ methods });

  await app.listen(process.env.PORT ?? 9000);
}

void bootstrap();
