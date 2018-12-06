import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Role } from '../../shared/models';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable()
export class RoleService {

  dataChange: BehaviorSubject<Role[]> = new BehaviorSubject<Role[]>([]);

  get data(): Role[] { return this.dataChange.value; }

  constructor(private http: HttpClient) { }

  getAll(): Observable<Role[]> {
    return this.http.get<Role[]>('/api/v1/roles');
  }

  getById(id: number): Observable<Role> {
    return this.http.get<Role>(`/api/v1/roles/${id}`);
  }

  create(role: Role): Observable<Role> {
    return this.http.post<Role>('/api/v1/roles', role);
  }

  update(role: Role): Observable<Role> {
    return this.http.put<Role>(`/api/v1/roles/${role.id}`, role);
  }

  delete(id: number): Observable<Role> {
    return this.http.post<Role>(`/api/v1/roles/${id}/delete`, null);
  }
}
