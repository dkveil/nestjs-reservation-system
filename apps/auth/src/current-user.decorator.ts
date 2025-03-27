import { createParamDecorator, ExecutionContext } from '@nestjs/common';

import { User } from './users/entities';

export function getCurrentUserByContext(ctx: ExecutionContext): User {
  const request = ctx.switchToHttp().getRequest();
  return request.user;
}

export const CurrentUser = createParamDecorator((_data: unknown, ctx: ExecutionContext) => {
  return getCurrentUserByContext(ctx);
});
