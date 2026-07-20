import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { JWTUserInterface } from '../../interface/jwt-user.interface';

export const GetUser = createParamDecorator(
  (data: unknown, ctx: ExecutionContext): JWTUserInterface => {
    const request: { user: JWTUserInterface } = ctx.switchToHttp().getRequest();
    return request.user;
  },
);