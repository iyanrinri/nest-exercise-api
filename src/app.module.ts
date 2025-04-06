import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { CatsController } from './cat.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true, // supaya bisa diakses di mana saja
    }),
  ],
  controllers: [AppController, CatsController],
  providers: [AppService],
})
export class AppModule {}
