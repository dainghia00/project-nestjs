import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PermissionsEntity } from './entities/permissions.entity';
import { FindOneOptions, Repository } from 'typeorm';
import { CreatePermissionDto } from './dto/permissions-create.dto';

import { EPermissions } from 'src/auth/enums/auth.enum';
import { RolesService } from 'src/roles/roles.service';

@Injectable()
export class PermissionsService {
  constructor(
    @InjectRepository(PermissionsEntity)
    private permissionsRepository: Repository<PermissionsEntity>,
    private rolesService: RolesService,
  ) {}

  async findAll() {
    return await this.permissionsRepository.find();
  }

  async findOne(options: FindOneOptions<PermissionsEntity>) {
    return await this.permissionsRepository.findOne(options);
  }

  async findOnePermission(id: string) {
    const role = await this.findOne({ where: { id } });
    if (!role) {
      throw new NotFoundException();
    }
    return role;
  }

  async updatePermissionByRoleId(roleId: string, permissions: EPermissions[]) {
    return Promise.allSettled(
      permissions.map(async (permission) => {
        const role = await this.rolesService.findOneRole(roleId);
        const isPermission = await this.findOne({ where: { permission } });
        console.log(
          await this.permissionsRepository.save({
            id: isPermission.id,
            role,
          }),
        );
        return await this.permissionsRepository.save({
          id: isPermission.id,
          role,
        });
      }),
    );
  }

  async createPermission(createPermissionDto: CreatePermissionDto) {
    const isExistedRole = await this.findOne({
      where: { permission: createPermissionDto.permission },
    });
    if (isExistedRole) {
      throw new BadRequestException();
    }
    return await this.permissionsRepository.save(createPermissionDto);
  }
}
