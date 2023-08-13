import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { RolesService } from './roles.service';
import { CreateRoleDto } from './dto/roles-create.dto';
import { Public } from 'src/auth/decorators/public.decorator';
import { User } from 'src/auth/decorators/user.decorator';
import { UsersEntity } from 'src/users/entities/users.entity';
import { RoleAddPermissions } from './dto/roles-add-permisisons.dto';

@Controller('roles')
export class RolesController {
  constructor(private rolesService: RolesService) {}

  @Get()
  async findAll() {
    return await this.rolesService.findAll();
  }

  @Get(':id')
  async findOneRole(@Param('id') id: string) {
    return await this.rolesService.findOneRole(id);
  }

  @Public()
  @Post()
  async createRole(@Body() createRoleDto: CreateRoleDto) {
    return await this.rolesService.createRole(createRoleDto);
  }

  @Public()
  @Post("/add-permissions")
  async addPermissionsForRole(@Body() roleAddPermissions: RoleAddPermissions) {
    return await this.rolesService.addPermissionsForRole(roleAddPermissions.roleName, roleAddPermissions.permissions); 
  }

}
