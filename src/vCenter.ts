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
} from './types';

const filterGenerator = (filter: any) =>
  Object.entries(filter)
    .map(([name, filterValue]) =>
      Array.isArray(filterValue)
        ? filterValue.map(value => `filter.${name}=${value}`).join('&&')
        : `filter.${name}=${filterValue}`,
    )
    .join('&&');

export class vCenter {
  private http: GotInstance<GotJSONFn>;
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

  private vCenterPostRequest = async <T>(path: string, filter?: any): Promise<T> => {
    const {
      body: { value },
    } = await this.http.post<T>(`${path}${filter ? `?${filterGenerator(filter)}` : ''}`);
    return value;
  };

  public getVMs = async (filter?: VMsFilter): Promise<VMs[]> => this.vCenterGetRequest('/vcenter/vm', filter);

  public powerGuestVM = async (vm: string, state: 'reboot' | 'shutdown') =>
    this.vCenterPostRequest(`/vcenter/vm/${vm}/guest/power?action=${state}`);

  public powerVM = async (vm: string, state: 'start' | 'reset' | 'stop' | 'suspend') =>
    this.vCenterPostRequest(`/vcenter/vm/${vm}/power/${state}`);

  public getVMPower = async (vm: string): Promise<VMPower> => this.vCenterGetRequest(`/vcenter/vm/${vm}/power`);

  public getVM = async (id: string): Promise<VM> => this.vCenterGetRequest(`/vcenter/vm/${id}`);

  public getHosts = async (filter?: HostsFilter): Promise<Hosts[]> => this.vCenterGetRequest('/vcenter/host', filter);

  public getDataStores = async (filter?: DatastoresFilter): Promise<Datastores[]> =>
    this.vCenterGetRequest('/vcenter/datastore', filter);

  public getDataCenters = async (filter?: DatacentersFitler): Promise<Datacenters[]> =>
    this.vCenterGetRequest('/vcenter/datacenter', filter);

  public getClusters = async (filter?: ClustersFilter): Promise<Clusters[]> =>
    this.vCenterGetRequest('/vcenter/cluster', filter);

  public getFolders = async (filter?: FoldersFilter): Promise<Folders[]> => this.vCenterGetRequest('/vcenter/folder', filter);
}

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
