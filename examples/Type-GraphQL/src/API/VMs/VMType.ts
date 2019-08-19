import { ObjectType, Field, Int } from 'type-graphql';

@ObjectType()
export class VMsType {
  @Field(type => Int)
  memory_size_MiB: number;

  @Field()
  vm: string;

  @Field()
  name: string;

  @Field()
  power_state: string;

  @Field(type => Int)
  cpu_count: number;
}
