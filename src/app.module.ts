import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserController } from './user/user.controller';
import { AppConfigModule } from '../config/config.module';
import { DatabaseModule } from '../database/database.module';
import { UserModule } from './user/user.module';
import { DataSource } from 'typeorm';

@Module({
  imports: [AppConfigModule, DatabaseModule, UserModule],
  controllers: [AppController, UserController],
  providers: [AppService],
})
export class AppModule {
  constructor(private dataSource: DataSource) {}
}
