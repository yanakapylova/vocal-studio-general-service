import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { setupSwagger } from './swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors();
  app.setGlobalPrefix('api', { exclude: ['doc'] });
  app.useGlobalPipes(new ValidationPipe());
  setupSwagger(app);
  await app.listen(process.env.PORT);

  console.log(
    `Server is running on http://${process.env.HOST}:${process.env.PORT}/api`,
  );
  console.log(
    `Swagger is running on http://${process.env.HOST}:${process.env.PORT}/docs`,
  );
}

bootstrap();
