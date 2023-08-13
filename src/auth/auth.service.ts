import { BadRequestException, Injectable } from '@nestjs/common';
import { UsersEntity } from 'src/users/entities/users.entity';
import { UsersService } from 'src/users/users.service';
import * as argon2 from 'argon2';
import { AuthSignInDto } from './dto/auth-signIn.dto';
import { IAuthResponse } from './interfaces/auth.interface';
import { JwtService } from '@nestjs/jwt';
import { RolesService } from 'src/roles/roles.service';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
    private rolesService: RolesService
  ) {}

  async validateUser(email: string, password: string): Promise<UsersEntity> {
    const user = await this.usersService.findOne({ where: { email } });
    if (!user) {
      throw new BadRequestException('Email not existed');
    }
    const isMatchedPassword = await argon2.verify(user.password, password);
    if (!isMatchedPassword) {
      throw new BadRequestException('Wrong password');
    }
    return user;
  }

  async signIn({ email, password }: AuthSignInDto): Promise<IAuthResponse> {
    await this.validateUser(email, password);
    const user = await this.usersService.findOne({ where: { email }, relations: {role: true} });
    const role = await this.rolesService.findOne({where:{roleName: user.role.roleName}, relations: {permissions:true}});
    const payload = {
      metaData: { superadmin: user.role.roleName },
      permissions: role.permissions,
      email,
      password,
    };
    console.log(payload);
    const accessToken = this.jwtService.sign(payload, { expiresIn: '12h' });
    return {
      accessToken,
    };
  }
}
