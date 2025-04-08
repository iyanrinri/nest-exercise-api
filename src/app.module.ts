import { Module, MiddlewareConsumer, NestModule, RequestMethod } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersController } from './users/users.controller';
import { UserController } from './users/user.controller';
import { AppConfigModule } from '../config/config.module';
import { DatabaseModule } from '../database/database.module';
import { UserModule } from './users/user.module';
import { DataSource } from 'typeorm';
import { AuthModule } from './auth/auth.module';
import { LoggerMiddleware } from './common/middlewares/logger.middleware';

@Module({
  imports: [AppConfigModule, DatabaseModule, UserModule, AuthModule],
  controllers: [AppController, UsersController, UserController],
  providers: [AppService],
})
export class AppModule implements NestModule {
  constructor(private dataSource: DataSource) {}

  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(LoggerMiddleware)
      .forRoutes({ path: 'users', method: RequestMethod.GET });
  }
}
