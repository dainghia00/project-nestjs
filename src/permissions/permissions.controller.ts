import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { PermissionsService } from './permissions.service';
import { CreatePermissionDto } from './dto/permissions-create.dto';
import { Public } from 'src/auth/decorators/public.decorator';
import { EPermissions, ERoles } from 'src/auth/enums/auth.enum';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { Permissions } from 'src/auth/decorators/permissions.decorator';

@Controller('permissions')
@Roles(ERoles.SUPER_ADMIN)
@Permissions(EPermissions.SUPER_ADMIN_MANAGE)
export class PermissionsController {
  constructor(private permissionsService: PermissionsService) {}
  @Get()
  async findAll() {
    return await this.permissionsService.findAll();
  }

  @Get(':id')
  async findOnePermission(@Param('id') id: string) {
    return await this.permissionsService.findOnePermission(id);
  }

  @Public()
  @Post()
  async createPermission(@Body() createPermissionDto: CreatePermissionDto) {
    return await this.permissionsService.createPermission(createPermissionDto);
  }
}
