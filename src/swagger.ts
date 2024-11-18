import { INestApplication } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { swagger } from './constants/constants';
import * as fs from 'fs';

export function setupSwagger(app: INestApplication) {
  const options = new DocumentBuilder()
    .setTitle(swagger.title)
    .setDescription(swagger.description)
    .setVersion(swagger.version)
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, options);
  SwaggerModule.setup(swagger.path, app, document);
  fs.writeFileSync(swagger.specification, JSON.stringify(document, null, 2));
}
