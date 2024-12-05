import { Module } from '@nestjs/common';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersEntity } from './entities/users.entity';
import { RolesModule } from 'src/roles/roles.module';
import { PermissionsModule } from 'src/permissions/permissions.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([UsersEntity]),
    RolesModule,
    PermissionsModule,
  ],
  controllers: [UsersController],
  providers: [UsersService],
  exports: [UsersService],
})
export class UsersModule {}
