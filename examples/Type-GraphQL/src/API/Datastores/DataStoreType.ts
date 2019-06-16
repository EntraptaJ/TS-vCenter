import { ObjectType, Field, Int } from 'type-graphql';

@ObjectType()
export class DataStoresType {
  @Field()
  datastore: string;

  @Field()
  name: string;

  @Field()
  type: string;

  @Field()
  free_space: number;

  @Field()
  capacity: number;
}
