import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { RolesService } from './roles.service';
import { CreateRoleDto } from './dto/roles-create.dto';
import { RoleAddPermissions } from './dto/roles-add-permisisons.dto';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { EPermissions, ERoles } from 'src/auth/enums/auth.enum';
import { Permissions } from 'src/auth/decorators/permissions.decorator';

@Controller('roles')
@Roles(ERoles.SUPER_ADMIN)
@Permissions(EPermissions.SUPER_ADMIN_MANAGE)
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

  @Post()
  async createRole(@Body() createRoleDto: CreateRoleDto) {
    return await this.rolesService.createRole(createRoleDto);
  }

  @Post('/add-permissions')
  async addPermissionsForRole(@Body() roleAddPermissions: RoleAddPermissions) {
    return await this.rolesService.addPermissionsForRole(
      roleAddPermissions.roleName,
      roleAddPermissions.permissions,
    );
  }
}
