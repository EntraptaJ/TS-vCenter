import { Resolver, Field, InputType, Arg, Mutation } from 'type-graphql';
import { loginVCSA } from 'ts-vcenter';
import { sign } from 'jsonwebtoken';

@InputType()
class LoginArgs {
  @Field(type => String)
  url: string;

  @Field(type => String)
  username: string;

  @Field(type => String)
  password: string;
}

@Resolver()
export default class AuthResolver {
  @Mutation(returns => String)
  public async Login(@Arg('user', { nullable: false }) user: LoginArgs): Promise<String> {
    const token = await loginVCSA(user);
    return sign({ token, url: user.url }, 'SECRET', {
      expiresIn: '60m',
    });
  }
}
