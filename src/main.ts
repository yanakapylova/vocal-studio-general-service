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

  await app.listen(process.env.PORT);
}

bootstrap();
