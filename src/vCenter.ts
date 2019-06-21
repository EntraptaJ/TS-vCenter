import got, { extend, GotInstance, GotJSONFn } from 'got';
import { Base64 } from 'js-base64';
import {
  loginVCSAParams,
  Session,
  VMs,
  VMsFilter,
  Hosts,
  HostsFilter,
  Datastores,
  DatastoresFilter,
  Datacenters,
  DatacentersFitler,
  Clusters,
  ClustersFilter,
  FoldersFilter,
  Folders,
  VM,
  VMPower,
  DataStore,
  Networks,
  NetworksFilter,
  ContentLibary,
  ContentLibraryItem,
  ContentLibrarys,
  VMTemplate,
  DeployVMParams,
} from './types';

/**
 * Generates a URL String filter from a provided object
 * Passed in object values need to match the URL filter.name name.
 */
const filterGenerator = (filter: any) =>
  Object.entries(filter)
    .map(([name, filterValue]) =>
      Array.isArray(filterValue)
        ? filterValue.map(value => `filter.${name}=${value}`).join('&&')
        : `filter.${name}=${filterValue}`,
    )
    .join('&&');

/**
 * vCenter Controller
 */
export class vCenter {
  private http: GotInstance<GotJSONFn>;
  /**
   * Initiates connection with vCenter
   * @remarks
   *
   * Creates a connection to a vCenter session created by the {@link loginVCSA}
   *
   * # Usage
   * ```typescript
   * async function connectvCSA() {
   *  const token = await loginVCSA({
   *    username: 'admin',
   *    url: 'https://vcsa.example.com',
   *    password: 'password',
   *  });
   *  const vcsa = new vCenter({ url: 'https://vcsa.example.com', token });
   * }
   * connectvCSA()
   * ```
   */
  constructor(session: Session) {
    this.http = extend({
      json: true, // Enable JSON on the HTTP Request to return Javascript Objects
      baseUrl: `${session.url}/rest`,
      headers: {
        'vmware-api-session-id': session.token,
      },
    });
  }

  private vCenterGetRequest = async <T>(path: string, filter?: any): Promise<T> => {
    const {
      body: { value },
    } = await this.http.get<T>(`${path}${filter ? `?${filterGenerator(filter)}` : ''}`);
    return value;
  };

  private vCenterPostRequest = async <T>(path: string, body?: any): Promise<T> => {
    const {
      body: { value },
    } = await this.http.post<T>(`${path}`, { body });
    return value;
  };

  /**
   * Returns an array of all VMs matching the filter, all if no filter is provided
   * ### Example
   * ```typescript
   * const VMs = await getVMs()
   * VMs.map((vm) => console.log(vm.name))
   * ```
   */
  public getVMs = async (filter?: VMsFilter): Promise<VMs[]> => this.vCenterGetRequest('/vcenter/vm', filter);

  /**
   * Performs guest based power actions on a VM.
   * ### Example
   * ```typescript
   * await vcsa.powerGuestVM('vm-16', 'shutdown')
   * ```
   */
  public powerGuestVM = async (vm: string, state: 'reboot' | 'shutdown') =>
    this.vCenterPostRequest(`/vcenter/vm/${vm}/guest/power?action=${state}`);

  /**
   * Performs power actions on a VM.
   * ### Example
   * ```typescript
   * await vcsa.powerVM('vm-16', 'start')
   * ```
   */
  public powerVM = async (vm: string, state: 'start' | 'reset' | 'stop' | 'suspend'): Promise<void> =>
    this.vCenterPostRequest(`/vcenter/vm/${vm}/power/${state}`);

  /**
   * Returns VM power information.
   * ### Example
   * ```typescript
   * const { state, clean_power_off } = await vcsa.getVMPower('vm-16');
   * ```
   */
  public getVMPower = async (vm: string): Promise<VMPower> => this.vCenterGetRequest(`/vcenter/vm/${vm}/power`);

  /**
   * Returns VM information for a single VM.
   * ### Example
   * ```typescript
   * const { name, nics } = await vcsa.getVM('vm-16');
   * ```
   */
  public getVM = async (id: string): Promise<VM> => this.vCenterGetRequest(`/vcenter/vm/${id}`);

  /**
   * Returns an array all Hosts on the vCenter
   * ### Example
   * ```typescript
   * const Hosts = await vcsa.getHosts()
   * Hosts.map((host) => console.log(host.name, host.connection_state, host.power_state))
   * ```
   */
  public getHosts = async (filter?: HostsFilter): Promise<Hosts[]> => this.vCenterGetRequest('/vcenter/host', filter);

  /**
   * Returns array of all datastores in vCenter matching the filter.
   */
  public getDataStores = async (filter?: DatastoresFilter): Promise<Datastores[]> =>
    this.vCenterGetRequest('/vcenter/datastore', filter);

  /**
   * Returns object of a single vCeneter datastore
   * ### Example
   * ```typescript
   * const { thin_provisioning_supported, name, free_space } = await vcsa.getDataStore('datastore-1015');
   * ```
   */
  public getDataStore = async (storeID: string): Promise<DataStore> => this.vCenterGetRequest(`/vcenter/datastore/${storeID}`);

  /**
   * Returns an array all datacenters in vCenter matching the filter
   */
  public getDataCenters = async (filter?: DatacentersFitler): Promise<Datacenters[]> =>
    this.vCenterGetRequest('/vcenter/datacenter', filter);

  /**
   * Returns an array of all Clusters in vCenter matching the filter.
   */
  public getClusters = async (filter?: ClustersFilter): Promise<Clusters[]> =>
    this.vCenterGetRequest('/vcenter/cluster', filter);

  /**
   * Returns an array of all folders in vCenter matching the filter
   */
  public getFolders = async (filter?: FoldersFilter): Promise<Folders[]> => this.vCenterGetRequest('/vcenter/folder', filter);

  /**
   * Returns array of all networks in vCenter
   * ### Example
   * ```typescript
   * const Networks = await vcsa.getNetworks();
   * ```
   */
  public getNetworks = async (filter?: NetworksFilter): Promise<Networks[]> =>
    this.vCenterGetRequest('/vcenter/network', filter);

  /**
   * Get all Content Libraries
   */
  public getContentLibaryID = async (): Promise<string[]> => this.vCenterGetRequest('/com/vmware/content/library');

  /**
   * Get Content Library Information
   */
  public getContentLibrary = async (ID: string): Promise<ContentLibary> =>
    this.vCenterGetRequest(`/com/vmware/content/library/id:${ID}`);

  /**
   * Get Item IDs in Content Library
   */
  public getContentLibaryItemIDs = async (ID: string): Promise<string[]> =>
    this.vCenterGetRequest(`/com/vmware/content/library/item?library_id=${ID}`);

  /**
   * Get Content Library Item Information
   */
  public getContentLibraryItem = async (ID: string): Promise<ContentLibraryItem> =>
    this.vCenterGetRequest(`/com/vmware/content/library/item/id:${ID}`);

  /**
   * Return an array of all Librarys, Info, and Items. Combo of {@link getContentLibaryID} {@link getContentLibrary}
   * ### Example
   * ```typescript
   * const Libraries = await vcsa.getContentLibrarys();
   * Libraries.map(Lib => Lib.items.map(itm => console.log(itm.name)));
   * ```
   */
  public getContentLibrarys = async (): Promise<ContentLibrarys[]> => {
    const Librarys = await this.getContentLibaryID();
    return Promise.all(
      Librarys.map(async ID => {
        const [info, ItemIDs] = await Promise.all([this.getContentLibrary(ID), this.getContentLibaryItemIDs(ID)]);
        return { info, items: await Promise.all(ItemIDs.map(itemID => this.getContentLibraryItem(itemID))) } as ContentLibrarys;
      }),
    );
  };

  /**
   * Returns VM Template information for content library Item
   * @param id The VM Template content library item
   */
  public getVMTemplate = async (id: string): Promise<VMTemplate> =>
    this.vCenterGetRequest(`/vcenter/vm-template/library-items/${id}`);

  /**
   * Deploys a VM Template Content Library Item
   * @param id VM Template Content Library Item
   *
   * ### Example
   * ```typescript
   *  const [Libraries] = await Promise.all([vcsa.getContentLibrarys()]);
   *  const Ubuntu = Libraries.find(({ items }) => items.find(({ name }) => name === 'Ubuntu')).items.find(
   *    ({ name }) => name === 'Ubuntu',
   *  );
   *  const [[{ host }], Datastores, Folders, Networks, UbuntuTemplate] = await Promise.all([
   *    vcsa.getHosts(),
   *    vcsa.getDataStores(),
   *    vcsa.getFolders(),
   *    vcsa.getNetworks(),
   *    vcsa.getVMTemplate(Ubuntu.id),
   * ]);
   * const Folder = Folders.find(({ type }) => type === 'VIRTUAL_MACHINE');
   * const DS = Datastores.find(({ name }) => name === 'vmh1.vdsk1');
   * const DMZNetwork = Networks.find(({ name }) => name === 'vswt1.DMZ');
   * const VMID = await vcsa.depoyVMTemplate(Ubuntu.id, {
   *  placement: { host: host, folder: Folder.folder },
   *  name: 'TS-vCenter2',
   *  disk_storage: { datastore: DS.datastore },
   *  vm_home_storage: {
   *    datastore: DS.datastore,
   *  },
   *  });
   *    const VM = await vcsa.getVM(VMID);
   * ```
   */
  public depoyVMTemplate = async (id: string, VM: DeployVMParams): Promise<string> =>
    this.vCenterPostRequest(`/vcenter/vm-template/library-items/${id}?action=deploy`, { spec: VM });
}

/**
 * Logs into vCenter and gets session token
 * ### Example
 * ```ts
 * const token = await loginVCSA({
 *  username: 'admin',
 *  url: 'https://vcsa.example.com',
 *  password: 'password'
 * })
 * ```
 */
export async function loginVCSA(params: loginVCSAParams): Promise<string> {
  const { url, username, password } = params;
  const {
    body: { value: token },
  } = await got.post<string>(`${url}/rest/com/vmware/cis/session`, {
    json: true,
    headers: {
      Authorization: `Basic ${Base64.encode(username + ':' + password)}`,
    },
  });
  return token;
}
