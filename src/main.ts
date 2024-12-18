import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { setupSwagger } from './swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Bind middlewares
  app.enableCors();

  // Bind global prefix
  app.setGlobalPrefix('api');

  // Bind global Pipes
  app.useGlobalPipes(new ValidationPipe());

  // Init Swagger docs
  setupSwagger(app);

  // TODO: Use only ConfigService to retrieve envs
  await app.listen(process.env.PORT);

  // TODO: Recommend add app bootstrap status message
}

bootstrap();
