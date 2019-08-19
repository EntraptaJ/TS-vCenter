export interface loginVCSAParams {
  url: string;
  username: string;
  password: string;
}

export interface Session {
  token: string;
  url: string;
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

export interface VMMemory {
  hot_add_increment_size_MiB: number;
  size_MiB: number;
  hot_add_enabled: boolean;
  hot_add_limit_MiB: number;
}

export type VMDiskType = 'IDE' | 'SCSI' | 'SATA';

export interface VMDisks {
  label: string;
  type: VMDiskType;
  scsi: {
    bus: number;
    unit: number;
  };
  backing: {
    vmdk_file: string;
    type: string;
  };
  capacity: number;
}

export interface VMCPU {
  hot_remove_enabled: boolean;
  count: number;
  hot_add_enabled: boolean;
  cores_per_socket: number;
}

export interface VMSATA {
  value: {
    bus: number;
    pci_slot_number: number;
    label: string;
    type: string;
  };
  key: string;
}

export interface VMSCSI {
  value: {
    scsi: {
      bus: number;
      unit: number;
    };
    pci_slot_number: number;
    label: string;
    type: string;
    sharing: string;
  };
  key: string;
}

export type NetworkType = 'STANDARD_PORTGROUP' | 'HOST_DEVICE' | 'DISTRIBUTED_PORTGROUP' | 'OPAQUE_NETWORK';

export type NICType = 'E1000' | 'E1000E' | 'PCNET32' | 'VMXNET' | 'VMXNET2' | 'VMXNET3';

export interface VMNIC {
  value: {
    start_connected: boolean;
    pci_slot_number: number;
    backing: {
      connection_cookie: number;
      distributed_switch_uuid: string;
      distributed_port: string;
      type: NetworkType;
      network: string;
    };
    mac_address: string;
    mac_type: string;
    allow_guest_control: boolean;
    wake_on_lan_enabled: boolean;
    label: string;
    state: string;
    type: NICType;
    upt_compatibility_enabled: boolean;
  };
  key: string;
}

export interface VMBoot {
  delay: number;
  efi_legacy_boot: boolean;
  retry_delay: number;
  enter_setup_mode: boolean;
  type: 'BIOS' | 'EFI';
  network_protocol: 'IPV4' | 'IPV6';
  retry: boolean;
}

export interface VM {
  cdroms: any[];
  memory: VMMemory;
  disks: {
    value: VMDisks;
    key: string;
  }[];
  parallel_ports: any[];
  sata_adapters: VMSATA[];
  cpu: VMCPU;
  scsi_adapters: VMSCSI[];
  power_state: PowerState;
  name: string;
  nics: VMNIC[];
  boot: VMBoot;
  guest_OS: string;
  hardware: {
    upgrade_policy: 'NEVER' | 'AFTER_CLEAN_SHUTDOWN' | 'ALWAYS';
    upgrade_status: 'NONE' | 'PENDING' | 'SUCCESS' | 'FAILED';
    version: string;
  };
}

export interface VMPower {
  clean_power_off: boolean;
  state: PowerState;
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

export interface DataStore {
  multiple_host_access: boolean;
  type: DataStoreType;
  thin_provisioning_supported: boolean;
  accessible: boolean;
  name: string;
  free_space: number;
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
  folders?: string | string[];
  names?: string | string[];
  type?: FolderType;
  parent_folders?: string | string[];
  datacenters?: string | string[];
}

export interface Networks {
  network: string;
  type: NetworkType;
  name: string;
}

export interface NetworksFilter {
  datacenters?: string | string[];
  folders?: string | string[];
  types?: NetworkType | NetworkType[];
  names?: string | string[];
  networks?: string | string[];
}

export type ContentLibaryStorageBackingType = 'DATASTORE' | 'OTHER';

export interface ContentLibraryStorageBackings {
  datastore_id?: string;
  type?: ContentLibaryStorageBackingType;
  storage_uri?: string;
}

export type ContentLibraryPublishAuth = 'BASIC' | 'NON';

export interface ContentLibraryPublishInfo {
  authentication_method: ContentLibraryPublishAuth;
  user_name: string;
  published: boolean;
  publish_url: string;
  persist_json_enabled: boolean;
}

export type ContentLibaryType = 'LOCAL' | 'SUBSCRIBED';

export interface ContentLibary {
  creation_time: string;
  storage_backings: ContentLibaryStorageBackingType[];
  last_modified_time: string;
  server_guid: string;
  description: string;
  type: ContentLibaryType;
  version: number;
  name: string;
  publish_info: ContentLibraryPublishInfo;
  id: string;
}

export interface ContentLibraryItem {
  creation_time: string;
  last_modified_time: string;
  description: string;
  type: string;
  version: string;
  content_version: string;
  library_id: string;
  size: number;
  cached: boolean;
  name: string;
  id: string;
  metadata_version: string;
}

export interface ContentLibrarys {
  info: ContentLibary;
  items: ContentLibraryItem[];
}

export interface VMTemplateMemory {
  size_MiB: number;
}

export interface VMTemplateCPU {
  count: number;
  cores_per_socket: number;
}

export interface VMTemplateHomeStorage {
  datastore: string;
  storage_policy?: string;
}

export interface VMTemplateDisk {
  value: {
    disk_storage: {
      datastore: string;
    };
    capacity?: number;
  };
  key: string;
}

export interface VMTemplateNIC {
  value: {
    mac_type: string;
    backing_type: NetworkType;
    network: string;
  };
  key: string;
}

export interface VMTemplate {
  memory: VMTemplateMemory;
  disks: VMTemplateDisk[];
  nics: VMTemplateNIC[];
  cpu: VMTemplateCPU;
  vm_home_storage: VMTemplateHomeStorage;
  guest_OS: string;
  vm_template: string;
}

/**
 * Added in vCenter 6.7 U1
 */
export interface DeployVMTemplateGuestCustomization {
  name: string;
}

export interface DeployVMTemplateHomeStorage {
  datastore?: string;
  storage_policy?: {
    policy: string;
    type: string;
  };
}

export interface DeployVMTemplatePlacement {
  folder: string;
  resource_pool?: string;
  host?: string;
  cluster?: string;
}

export interface DeployVMTemplateDiskStorage {
  datastore: string;
}

export interface DeployVMTemplateHardwareCustomization {
  cpu_update?: {
    num_cpus?: number;
    num_cores_per_socket?: number;
  };
  nics?: {
    key: string;
    value: {
      network: string;
    };
  }[];
}

export interface DeployVMParams {
  name: string;
  disk_storage?: DeployVMTemplateDiskStorage;
  description?: string;
  powered_on?: boolean;
  placement: DeployVMTemplatePlacement;
  hardware_customization?: DeployVMTemplateHardwareCustomization;
  vm_home_storage?: DeployVMTemplateHomeStorage;
}

export interface GuestVMFullName {
  args: string[];
  default_message: string;
  id: string;
}

export interface GuestVMInfo {
  full_name: GuestVMFullName;
  /**
   * OS Name
   */
  name: string

  ip_address: string;

  family: string;

  host_name: string;
}