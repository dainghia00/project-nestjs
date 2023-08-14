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

@Injectable()
export class PermissionsService {
  constructor(
    @InjectRepository(PermissionsEntity)
    private permissionsRepository: Repository<PermissionsEntity>,
  ) {}

  async findAll() {
    return await this.permissionsRepository.find();
  }

  async findOne(options: FindOneOptions<PermissionsEntity>) {
    return await this.permissionsRepository.findOne(options);
  }

  async findOnePermission(id: string) {
    const permisison = await this.findOne({ where: { id } });
    if (!permisison) {
      throw new NotFoundException();
    }
    return permisison;
  }

  async findOnePermissionByName(name: EPermissions) {
    const permisison = await this.findOne({ where: { permission: name } });
    if (!permisison) {
      throw new NotFoundException();
    }
    return permisison;
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
