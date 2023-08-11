import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { RolesEntity } from './entities/roles.entity';
import { FindOneOptions, Repository } from 'typeorm';
import { CreateRoleDto } from './dto/roles-create.dto';
import { ERoles } from 'src/auth/enums/auth.enum';
import { Public } from 'src/auth/decorators/public.decorator';

@Injectable()
export class RolesService {
  constructor(
    @InjectRepository(RolesEntity)
    private rolesRepository: Repository<RolesEntity>,
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
      throw new NotFoundException();
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
}
