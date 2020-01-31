import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { MoleculerList, MoleculerListOptions } from '../../shared/models/MoleculerWrapper';
import { Role } from '../../shared/models';
import { toURL } from './api-utils';
import { createHttpParams } from '../../shared/utils';

const BASE_URL = toURL('v2/acl/v1/roles');

@Injectable()
export class RoleService {

  constructor(private http: HttpClient) { }

  list(options: MoleculerListOptions): Promise<MoleculerList<Role>> {
    return this.http.get<MoleculerList<Role>>(
      BASE_URL,
      { params: createHttpParams({ ...options }) },
    ).toPromise();
  }

  get(id: string): Promise<Role> {
    return this.http.get<Role>(`${BASE_URL}/${id}`).toPromise();
  }

  async create(role: Role): Promise<Role> {
    return await this.http.post<Role>(BASE_URL, role).toPromise();
  }

  async update(role: Role): Promise<Role> {
    return await this.http.put<Role>(`${BASE_URL}/${role._id}`, role).toPromise();
  }

  async remove(id: string): Promise<Role> {
    return await this.http.delete<Role>(`${BASE_URL}/${id}`).toPromise();
  }
}
