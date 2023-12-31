import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import AppDataSource from 'ormconfig';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      useFactory: () => {
        return AppDataSource.options;
      },
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
