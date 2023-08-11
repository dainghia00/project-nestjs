import { Body, Controller, Get, Param, Patch, Post } from '@nestjs/common';
import { PermissionsService } from './permissions.service';
import { CreatePermissionDto } from './dto/permissions-create.dto';
import { Public } from 'src/auth/decorators/public.decorator';
import { User } from 'src/auth/decorators/user.decorator';
import { UsersEntity } from 'src/users/entities/users.entity';
import { EPermissions } from 'src/auth/enums/auth.enum';

@Controller('permissions')
export class PermissionsController {
  constructor(private permissionsService: PermissionsService) {}
  @Get()
  async findAll() {
    return await this.permissionsService.findAll();
  }

  @Get(':id')
  async findOneRole(@Param('id') id: string) {
    return await this.permissionsService.findOnePermission(id);
  }

  @Post()
  async createRole(@Body() createPermissionDto: CreatePermissionDto) {
    return await this.permissionsService.createPermission(createPermissionDto);
  }

  @Patch()
  async update(
    @User() user: UsersEntity,
    @Body('permission') permission: EPermissions[],
  ) {
    return await this.permissionsService.updatePermissionByRoleId(
      user.roleId,
      permission,
    );
  }
}
