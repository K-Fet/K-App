import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Role } from '../../shared/models';
import { toURL } from './api-utils';

@Injectable()
export class RoleService {

  constructor(private http: HttpClient) { }

  getAll(): Promise<Role[]> {
    return this.http.get<Role[]>(toURL('v1/roles')).toPromise();
  }

  getById(id: number): Promise<Role> {
    return this.http.get<Role>(toURL(`v1/roles/${id}`)).toPromise();
  }

  create(role: Role): Promise<Role> {
    return this.http.post<Role>(toURL('v1/roles'), role).toPromise();
  }

  update(role: Role): Promise<Role> {
    return this.http.put<Role>(toURL(`v1/roles/${role.id}`), role).toPromise();
  }

  delete(id: number): Promise<Role> {
    return this.http.post<Role>(toURL(`v1/roles/${id}/delete`), null).toPromise();
  }
}
