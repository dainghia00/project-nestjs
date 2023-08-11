import { Body, Controller, Delete, Get, Param, Post } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersEntity } from './entities/users.entity';
import { CreateUserDto } from './dto/users-create.dto';
import { Public } from 'src/auth/decorators/public.decorator';
import { IsSuperAdmin } from 'src/auth/decorators/superadmin.decorator';
import { Permissions } from 'src/auth/decorators/permissions.decorator';
import { EPermissions } from 'src/auth/enums/auth.enum';

@Controller('users')
export class UsersController {
  constructor(private usersService: UsersService) {}

  @IsSuperAdmin()
  @Permissions(EPermissions.ADMIN_READ)
  @Get()
  async findAllUsers(): Promise<UsersEntity[]> {
    return await this.usersService.findAllUsers();
  }

  @Get(':id')
  async findOneUser(@Param('id') id: string): Promise<UsersEntity> {
    return await this.usersService.findOneUser(id);
  }

  @IsSuperAdmin()
  @Permissions(EPermissions.ADMIN_CREATE)
  @Post()
  async createUser(@Body() createUserDto: CreateUserDto): Promise<UsersEntity> {
    return await this.usersService.createUser(createUserDto);
  }

  @IsSuperAdmin()
  @Permissions(EPermissions.ADMIN_DELETE)
  @Public()
  @Delete(':id')
  async deleteUser(@Param('id') id: string): Promise<{ message: string }> {
    return await this.usersService.deleteUser(id);
  }
}
