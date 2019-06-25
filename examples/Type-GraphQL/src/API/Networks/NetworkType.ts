import { ObjectType, Field, registerEnumType } from 'type-graphql';

export enum NetworkType {
  'STANDARD_PORTGROUP' = 'STANDARD_PORTGROUP',
  'HOST_DEVICE' = 'HOST_DEVICE',
  'DISTRIBUTED_PORTGROUP' = 'DISTRIBUTED_PORTGROUP',
  'OPAQUE_NETWORK' = 'OPAQUE_NETWORK',
}

registerEnumType(NetworkType, {
  name: 'NetworkType', // this one is mandatory
  description: 'The type of the vCenter Network', // this one is optional
});

@ObjectType()
export class NetworksType {
  @Field()
  network: string;

  @Field(type => NetworkType)
  type: NetworkType;

  @Field()
  name: string;
}
