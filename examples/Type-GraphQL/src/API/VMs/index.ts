import { Resolver, Query } from 'type-graphql';
import { loginVCSA, vCenter, VMs } from 'ts-vcenter';
import { VMsType } from './VMType';

@Resolver()
export default class vCenterResolver {
  @Query(returns => [VMsType])
  public async VMs(): Promise<VMs[]> {
    const token = await loginVCSA({
      username: 'admin',
      url: 'https://vcsa.example.com',
      password: 'password',
    });
    let vcsa = new vCenter({ url: 'https://vcsa.example.com', token });
    return vcsa.getVMs();
  }
}
