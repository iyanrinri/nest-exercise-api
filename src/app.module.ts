import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersController } from './users/users.controller';
import { UserController } from './users/user.controller';
import { AppConfigModule } from '../config/config.module';
import { DatabaseModule } from '../database/database.module';
import { UserModule } from './users/user.module';
import { DataSource } from 'typeorm';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [AppConfigModule, DatabaseModule, UserModule, AuthModule],
  controllers: [AppController, UsersController, UserController],
  providers: [AppService],
})
export class AppModule {
  constructor(private dataSource: DataSource) {}
}
