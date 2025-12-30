import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import * as entities from './entities';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'rudraasakariya',
      password: '',
      database: 'rara_platform',
      entities: Object.values(entities),
      synchronize: false,
    }),
  ],
})
export class DatabaseModule {}
