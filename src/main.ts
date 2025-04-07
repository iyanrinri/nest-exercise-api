import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import {
  DocumentBuilder,
  SwaggerDocumentOptions,
  SwaggerModule,
} from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const config = new DocumentBuilder()
    .setTitle('Nest API')
    .setDescription('The Nest API description')
    .setVersion('1.0')
    .addBearerAuth()
    .build();
  const options: SwaggerDocumentOptions = {
    operationIdFactory: (controllerKey: string, methodKey: string) => methodKey,
  };
  const document = SwaggerModule.createDocument(app, config, options);

  SwaggerModule.setup('api', app, document, {
    swaggerOptions: {
      requestInterceptor: (req: { headers: { [x: string]: string } }) => {
        req.headers['accept'] = 'application/json';
        return req;
      },
      persistAuthorization: true,
    },
  });
  SwaggerModule.setup('api', app, document);
  await app.listen(3000, '0.0.0.0');
}
void bootstrap();
