import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Patch,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersEntity } from './entities/users.entity';
import { CreateUserDto } from './dto/users-create.dto';
import { Public } from 'src/auth/decorators/public.decorator';
import { Permissions } from 'src/auth/decorators/permissions.decorator';
import { EPermissions, ERoles } from 'src/auth/enums/auth.enum';
import { Roles } from 'src/auth/decorators/roles.decorator';

@Controller('users')
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Permissions(EPermissions.SUPER_ADMIN_READ, EPermissions.ADMIN_READ)
  @Get()
  async findAllUsers(): Promise<UsersEntity[]> {
    return await this.usersService.findAllUsers();
  }

  @Get(':id')
  async findOneUser(@Param('id') id: string): Promise<UsersEntity> {
    return await this.usersService.findOneUser(id);
  }

  // @Roles(ERoles.SUPER_ADMIN)
  // @Permissions(EPermissions.SUPER_ADMIN_CREATE)
  @Public()
  @Post()
  async createUser(@Body() createUserDto: CreateUserDto): Promise<UsersEntity> {
    return await this.usersService.createUser(createUserDto);
  }

  @Roles(ERoles.SUPER_ADMIN)
  @Permissions(EPermissions.SUPER_ADMIN_DELETE)
  @Delete(':id')
  async deleteUser(@Param('id') id: string): Promise<{ message: string }> {
    return await this.usersService.deleteUser(id);
  }
}
