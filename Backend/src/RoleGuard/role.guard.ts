import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import * as jwt from 'jsonwebtoken';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const requiredRoles = this.reflector.get<string[]>(
      'roles',
      context.getHandler(),
    );

    const request = context.switchToHttp().getRequest();
    const authHeader = request.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new UnauthorizedException('Please, Login First!');
    }
    const token = authHeader.substring(7);
    try {
      const decoded: any = jwt.decode(token);
      const userRole = decoded.role;
      if (userRole.includes(requiredRoles)) {
        return true;
      }
    } catch (error) {
      console.error('Error decoding token:', error.message);
      throw new Error(error);
    }
    throw new UnauthorizedException(
      `Only ${requiredRoles.join(' or ')} can access this service`,
    );
  }
}
