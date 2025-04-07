// database/database.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigService } from '@nestjs/config';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => {
        const db =
          config.get<{
            host: string;
            port: number;
            username: string;
            password: string;
            database: string;
          }>('database') ??
          (() => {
            throw new Error('Database configuration is missing');
          })();
        return {
          type: 'mysql',
          host: db.host,
          port: db.port,
          username: db.username,
          password: db.password,
          database: db.database,
          autoLoadEntities: true,
        };
      },
    }),
  ],
})
export class DatabaseModule {}
