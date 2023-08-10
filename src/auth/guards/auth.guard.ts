import {
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AuthGuard } from '@nestjs/passport';
import { Request } from 'express';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { IS_PUBLIC_KEY } from '../decorators/public.decorator';
import { IS_SUPER_ADMIN } from '../decorators/superadmin.decorator';
import { PERMISSIONS_KEY } from '../decorators/permissions.decorator';
import { EPermissions } from '../enums/auth.enum';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
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

    const requiredSuperAdmin = this.reflector.get<boolean>(
      IS_SUPER_ADMIN,
      context.getHandler(),
    );
    const isSuperAdmin = request.user?.metaData.superAdmin;

    if (requiredSuperAdmin) {
      if (!isSuperAdmin) {
        throw new UnauthorizedException('User not permitted');
      }
    }

    const requriedPermissions = this.reflector.get<string[]>(
      PERMISSIONS_KEY,
      context.getHandler(),
    );

    const usersPermissions = new Map(
      request.user?.permissions.map((permission: EPermissions) => [
        permission,
        true,
      ]),
    );

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

    try {
      const payload = await this.jwtService.verifyAsync(token, {
        secret: this.configService.get('JWT_SECRET_KEY'),
      });
      // // 💡 We're assigning the payload to the request object here
      // // so that we can access it in our route handlers
      request['user'] = payload;
    } catch (error) {
      throw new UnauthorizedException();
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
