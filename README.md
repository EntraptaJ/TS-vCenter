# TS-vCenter

TS-vCenter is a NodeJS module for interacting with a vCenter Server via the Automation REST API

typedoc site coming soon. But for now jsdoc/tsdoc should have everything needed. Everything is fully typed.

## Working

- Combo method of Content Library, Items, and Info
- VM Templates - List, Deployment
- VMs
- Hosts
- Datastores
- Most Content Library Stuff
- Folders
- Datacenters
- Clusters

## Usage

First you need to get a session token

```typescript
import { loginVCSA, vCenter } from 'ts-vcenter';


const Start = async () => {
  const token = await loginVCSA({
    username: 'Administrator@vsphere.local',
    url: 'https://vsphere.local',
    password: 'password',
  });

  const vcsa = new vCenter({ url: 'https://vsphere.local', token });

  const VMs = await vcsa.getVMs();
  console.log(VMs);
}

Start()
};
```

### Get Hosts

```typescript
const getHosts = async () => {
  const Hosts = await vcsa.getHosts();
  Hosts.map(host => console.log(host.name, host.connection_state, host.power_state));
};
```

For more examples checkout the JSDoc/TSDoc defs on each method.

## Extras

If you need any more methods added just open an issue on the GitHub repo and I'll have it added within a day. Or open a PR if you would like.

All requests are done with the internal this.vCenterGetRequest or this.vCenterPostRequest methods in the vCenter class

Example

```typescript
  public getHosts = async (filter?: HostsFilter): Promise<Hosts[]> => this.vCenterGetRequest('/vcenter/host', filter);
```
