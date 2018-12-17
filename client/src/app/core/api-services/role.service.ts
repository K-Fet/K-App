import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Role } from '../../shared/models';

@Injectable()
export class RoleService {

  constructor(private http: HttpClient) { }

  getAll(): Promise<Role[]> {
    return this.http.get<Role[]>('/api/v1/roles').toPromise();
  }

  getById(id: number): Promise<Role> {
    return this.http.get<Role>(`/api/v1/roles/${id}`).toPromise();
  }

  create(role: Role): Promise<Role> {
    return this.http.post<Role>('/api/v1/roles', role).toPromise();
  }

  update(role: Role): Promise<Role> {
    return this.http.put<Role>(`/api/v1/roles/${role.id}`, role).toPromise();
  }

  delete(id: number): Promise<Role> {
    return this.http.post<Role>(`/api/v1/roles/${id}/delete`, null).toPromise();
  }
}
