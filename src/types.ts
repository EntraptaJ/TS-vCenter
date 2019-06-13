export interface loginVCSAParams {
  url: string | URL;
  username: string;
  password: string;
}

export interface Session {
  token: string;
  url: string | URL;
}

type PowerState = 'POWERED_ON' | 'POWERED_OFF';

export interface VMs {
  memory_size_MiB: number;
  vm: string;
  name: string;
  power_state: PowerState;
  cpu_count: number;
}

export interface VMsFilter {
  names?: string | string[];
  power?: PowerState | PowerState[];
  hosts?: string | string[];
}

type HostConnection = 'CONNECTED' | 'DISCONNECTED' | 'NOT_RESPONDING';
export interface Hosts {
  host: string;
  name: string;
  connection_state: HostConnection;
  power_state: PowerState;
}

export interface HostsFilter {
  clusters?: string | string[];
  connection_states?: HostConnection | HostConnection[];
  names?: string | string[];
}

type DataStoreType = 'VMFS' | 'NFS' | 'NFS41' | 'CIFS' | 'VSAN' | 'VFFS' | 'VVOL';

export interface Datastores {
  datastore: string;
  name: string;
  type: DataStoreType;
  free_space: number;
  capacity: number;
}

export interface DatastoresFilter {
  names?: string | string[];
  types?: DataStoreType | DataStoreType[];
  folders?: string | string[];
  datacenters?: string | string[];
  datastores?: string | string[];
}

export interface Datacenters {
  name: string;
  datacenter: string;
}

export interface DatacentersFitler {
  datacenters?: string | string[];
  names?: string | string[];
}

export interface Clusters {
  drs_enabled: boolean;
  ha_enabled: boolean;
  name: string;
  cluster: string;
}

export interface ClustersFilter {
  datacenters?: string | string[];
  folders?: string | string[];
  clusters?: string | string[];
  names?: string | string[];
}

type FolderType = 'DATACENTER' | 'DATASTORE' | 'HOST' | 'NETWORK' | 'VIRTUAL_MACHINE';

export interface Folders {
  name: string;
  type: FolderType;
  folder: string;
}

export interface FoldersFilter {
  names?: string | string[];
  type?: FolderType;
  folders?: string | string[];
}
