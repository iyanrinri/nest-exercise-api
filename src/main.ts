import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { WinstonModule } from 'nest-winston';
import { loggerConfig } from './config/logger.config';
import { setupSwagger } from './config/swagger.config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: WinstonModule.createLogger(loggerConfig),
  });

  setupSwagger(app);
  await app.listen(3000, '0.0.0.0');
}
void bootstrap();
