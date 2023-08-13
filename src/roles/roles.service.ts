import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { RolesEntity } from './entities/roles.entity';
import { FindOneOptions, Repository } from 'typeorm';
import { CreateRoleDto } from './dto/roles-create.dto';
import { EPermissions, ERoles } from 'src/auth/enums/auth.enum';
import { PermissionsService } from 'src/permissions/permissions.service';

@Injectable()
export class RolesService {
  constructor(
    @InjectRepository(RolesEntity)
    private rolesRepository: Repository<RolesEntity>,
    private permissionsService: PermissionsService
  ) {}

  async findAll() {
    return await this.rolesRepository.find();
  }

  async findOne(options: FindOneOptions<RolesEntity>) {
    return await this.rolesRepository.findOne(options);
  }

  async findOneRole(id: string) {
    const role = await this.findOne({ where: { id } });
    if (!role) {
      throw new NotFoundException();
    }
    return role;
  }

  async findOneRoleByRoleName(name: string) {
    const role = await this.findOne({ where: { roleName: name as ERoles } });
    if (!role) {
      throw new NotFoundException("Role not found");
    }
    return role;
  }

  async createRole(createRoleDto: CreateRoleDto) {
    const isExistedRole = await this.findOne({
      where: { roleName: createRoleDto.roleName },
    });
    if (isExistedRole) {
      throw new BadRequestException();
    }
    return await this.rolesRepository.save(createRoleDto);
  }

  async addPermissionsForRole(roleName: ERoles, permissions: EPermissions[]) {
    const role = await this.findOne({where: { roleName }, relations: { permissions: true }});
    Promise.allSettled( 
      permissions.map(async (permission) => {
      const permissionId = await this.permissionsService.findOnePermissionByName(permission);
      role.permissions.push(permissionId);
    }))
   return await this.rolesRepository.save(role);
  }
}
