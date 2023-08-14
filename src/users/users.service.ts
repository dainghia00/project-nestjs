import {
  BadRequestException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UsersEntity } from './entities/users.entity';
import { FindOneOptions, Repository } from 'typeorm';
import { CreateUserDto } from './dto/users-create.dto';
import * as argon2 from 'argon2';
import { EPermissions, ERoles } from 'src/auth/enums/auth.enum';
import { RolesService } from 'src/roles/roles.service';
import { PermissionsService } from 'src/permissions/permissions.service';

@Injectable()
export class UsersService {
  logger = new Logger(UsersService.name);
  constructor(
    @InjectRepository(UsersEntity)
    private userRepository: Repository<UsersEntity>,
    private rolesService: RolesService,
    private permissionsService: PermissionsService,
  ) {}

  async findAllUsers(): Promise<UsersEntity[]> {
    return await this.userRepository.find();
  }

  async findOne(options: FindOneOptions<UsersEntity>) {
    return await this.userRepository.findOne(options);
  }

  async findOneUser(id: string): Promise<UsersEntity> {
    const user = await this.findOne({
      where: { id },
      relations: { role: true },
    });
    if (!user) {
      throw new NotFoundException('User was not found');
    }
    return user;
  }

  async createUser(createUserDto: CreateUserDto): Promise<UsersEntity> {
    const isExistedUser = await this.findOne({
      where: { email: createUserDto.email },
    });
    if (isExistedUser) {
      throw new BadRequestException('Email is existed');
    }
    const hashPassword = await argon2.hash(createUserDto.password);
    const role = await this.rolesService.findOneRoleByRoleName(
      createUserDto.role,
    );

    // if (createUserDto.role === ERoles.SUPER_ADMIN) {
    //   const role = await this.rolesService.findAll();
    //   if (!role) {
    //     await this.rolesService.createRole({ roleName: ERoles.SUPER_ADMIN });
    //   }
    //   const permissions = await this.permissionsService.findAll();
    //   if (!permissions) {
    //     const permisison = await this.permissionsService.createPermission({
    //       permission: EPermissions.SUPER_ADMIN_MANAGE,
    //     });
    //     const permissionWasAddedByRole = await this.rolesService.addPermissionsForRole()
    //   } else {
    //     await this.rolesService.addPermissionsForRole(createUserDto.role, [
    //       EPermissions.SUPER_ADMIN_CREATE,
    //       EPermissions.SUPER_ADMIN_READ,
    //       EPermissions.SUPER_ADMIN_UPDATE,
    //       EPermissions.SUPER_ADMIN_DELETE,
    //       EPermissions.SUPER_ADMIN_MANAGE,
    //     ]);
    //   }
    // }

    try {
      const user = await this.userRepository.save({
        ...createUserDto,
        role,
        password: hashPassword,
      });
      delete user.password;
      return user;
    } catch (error) {
      this.logger.error(error.message);
      throw new BadRequestException('Email is existed');
    }
  }

  async deleteUser(id: string): Promise<{ message: string }> {
    await this.findOneUser(id);
    await this.userRepository.softDelete(id);
    return { message: 'ok' };
  }
}
