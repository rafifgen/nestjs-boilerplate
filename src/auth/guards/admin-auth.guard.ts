import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Response } from 'express';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { AllConfigType } from '../../config/config.type';
import { JwtPayloadType } from '../strategies/types/jwt-payload.type';
import { RoleEnum } from '../../roles/roles.enum';

@Injectable()
export class AdminAuthGuard implements CanActivate {
  constructor(
    private jwtService: JwtService,
    private configService: ConfigService<AllConfigType>,
  ) {}

  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const response = context.switchToHttp().getResponse<Response>();
    const token = this.extractTokenFromCookie(request);

    if (!token) {
      // Redirect to login page if no token
      response.redirect('/web/login');
      return false;
    }

    try {
      const payload: JwtPayloadType = this.jwtService.verify(token, {
        secret: this.configService.getOrThrow('auth.secret', { infer: true }),
      });

      // Check if user has admin role (role.id === 1)
      if (payload.role?.id !== RoleEnum.admin) {
        // Redirect to login if not admin
        response.redirect('/web/login');
        return false;
      }

      // Attach user info to request for later use
      (request as any).user = payload;
      return true;
    } catch {
      // Invalid or expired token - redirect to login
      response.redirect('/web/login');
      return false;
    }
  }

  private extractTokenFromCookie(request: any): string | null {
    const cookies = request.cookies || {};
    return cookies.authToken || null;
  }
}
