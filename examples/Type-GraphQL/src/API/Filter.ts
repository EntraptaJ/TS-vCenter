import { MiddlewareFn } from 'type-graphql';

export const FilterInterceptor: MiddlewareFn = async ({ args }, next) => {
  const result = await next();
  if (args.filter) {
    return result.filter(itm => (itm ? Object.entries(args.filter).every(([type, value]) => itm[type].includes(value)) : true));
  }
  return result;
};
