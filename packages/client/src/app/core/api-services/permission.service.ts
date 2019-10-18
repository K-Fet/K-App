import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Permission } from '../../shared/models';
import { toURL } from './api-utils';

@Injectable()
export class PermissionService {

  constructor(private http: HttpClient) {}

  getAll(): Promise<Permission[]> {
    return this.http.get<Permission[]>(toURL('v1/permissions')).toPromise();
  }
}
