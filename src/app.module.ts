import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { PermissionsModule } from './permissions/permissions.module';
import { RolesModule } from './roles/roles.module';
import AppDataSource from 'ormconfig';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      useFactory: () => {
        return AppDataSource.options;
      },
    }),
    UsersModule,
    AuthModule,
    PermissionsModule,
    RolesModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
