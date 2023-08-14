import {
  ExecutionContext,
  Injectable,
  Logger,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AuthGuard } from '@nestjs/passport';
import { Request } from 'express';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { IS_PUBLIC_KEY } from '../decorators/public.decorator';
import { ROLES_KEY, Roles } from '../decorators/roles.decorator';
import { PERMISSIONS_KEY } from '../decorators/permissions.decorator';
import { EPermissions, ERoles } from '../enums/auth.enum';
import { PermissionsEntity } from 'src/permissions/entities/permissions.entity';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  logger = new Logger(JwtAuthGuard.name);
  constructor(
    private reflector: Reflector,
    private configService: ConfigService,
    private jwtService: JwtService,
  ) {
    super();
  }

  async canActivate(context: ExecutionContext) {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (isPublic) {
      return true;
    }

    const request = context.switchToHttp().getRequest();
    const token = this.extractTokenFromHeader(request).token;

    if (!token) {
      throw new UnauthorizedException();
    }

    try {
      const payload = await this.jwtService.verifyAsync(token, {
        secret: this.configService.get('JWT_SECRET_KEY'),
      });
      // // 💡 We're assigning the payload to the request object here
      // // so that we can access it in our route handlers
      request['user'] = payload;
      const requiredSuperAdmin = this.reflector.get<string>(
        ROLES_KEY,
        context.getHandler(),
      );
      const isSuperAdmin = request.user?.role;
      //console.log(request.user);
      if (requiredSuperAdmin !== undefined) {
        if (isSuperAdmin !== ERoles.SUPER_ADMIN) {
          throw new UnauthorizedException('User not permitted');
        }
      }

      const requriedPermissions = this.reflector.get<string[]>(
        PERMISSIONS_KEY,
        context.getHandler(),
      );

      console.log(request.user?.permissions);

      const usersPermissions = new Map(
        request.user?.permissions.map((permission: PermissionsEntity) => [
          permission.permission,
          true,
        ]),
      );

      console.log(usersPermissions);

      if (requriedPermissions !== undefined) {
        if (requriedPermissions.length === 0) {
          throw new Error(
            'Permission decorator set, but empty, either remove decorator or add permissions',
          );
        }
        requriedPermissions.forEach((requriedPermission) => {
          if (!usersPermissions.has(requriedPermission)) {
            throw new UnauthorizedException(
              `Missing permission ${requriedPermission}`,
            );
          }
        });
      }
    } catch (error) {
      this.logger.error(error.message);
      throw new UnauthorizedException(error.message);
    }
    return true;
  }

  extractTokenFromHeader(request: Request): {
    type: string;
    token: string;
  } {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    return { type, token };
  }
}
