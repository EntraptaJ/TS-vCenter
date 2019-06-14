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
} from './types';

/**
 * Generates a URL String filter from a provided object
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
   * @remarks
   * ```typescript
   * const VMs = await getVMs()
   * VMs.map((vm) => console.log(vm.name))
   * ```
   */
  public getVMs = async (filter?: VMsFilter): Promise<VMs[]> => this.vCenterGetRequest('/vcenter/vm', filter);

  /**
   * Performs guest based power actions on a VM.
   * @remarks
   * ```typescript
   * await vcsa.powerGuestVM('vm-16', 'shutdown')
   * ```
   */
  public powerGuestVM = async (vm: string, state: 'reboot' | 'shutdown') =>
    this.vCenterPostRequest(`/vcenter/vm/${vm}/guest/power?action=${state}`);

  /**
   * Performs power actions on a VM.
   * @remarks
   * ```typescript
   * await vcsa.powerVM('vm-16', 'start')
   * ```
   */
  public powerVM = async (vm: string, state: 'start' | 'reset' | 'stop' | 'suspend'): Promise<void> =>
    this.vCenterPostRequest(`/vcenter/vm/${vm}/power/${state}`);

  /**
   * Returns VM power information.
   * @remarks
   * ```typescript
   * const { state, clean_power_off } = await vcsa.getVMPower('vm-16');
   * ```
   */
  public getVMPower = async (vm: string): Promise<VMPower> => this.vCenterGetRequest(`/vcenter/vm/${vm}/power`);

  /**
   * Returns VM information for a single VM.
   * @remarks
   * ```typescript
   * const { name, nics } = await vcsa.getVM('vm-16');
   * ```
   */
  public getVM = async (id: string): Promise<VM> => this.vCenterGetRequest(`/vcenter/vm/${id}`);

  /**
   * Returns an array all Hosts on the vCenter
   * @remarks
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
   * @remarks
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

  public getNetworks = async (filter?: NetworksFilter): Promise<Networks[]> =>
    this.vCenterGetRequest('/vcenter/network', filter);
}

/**
 * Logs into vCenter and gets session token
 * @remarks
 * Usage
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
