import { MiddlewareFn, ForbiddenError } from 'type-graphql';
import { vCenter } from 'ts-vcenter';

/**
 * Filter Middleware
 * Have a arg object on your function with the same names as your return properties
 */
export const AuthInterceptor: MiddlewareFn<{ vcsa?: vCenter }> = async ({ args, context }, next) => {
  if (!context.vcsa) throw new ForbiddenError();
  const result = await next();
  return result;
};
