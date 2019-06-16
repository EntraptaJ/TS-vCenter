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

## Extras

If you need any more methods added just open an issue on the GitHub repo and I'll have it added within a day. Or open a PR if you would like.

All requests are done with the internal this.vCenterGetRequest or this.vCenterPostRequest methods in the vCenter class

Example

```typescript
  public getHosts = async (filter?: HostsFilter): Promise<Hosts[]> => this.vCenterGetRequest('/vcenter/host', filter);
```
