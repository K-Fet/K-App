import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Role } from '../../shared/models';
import { toURL } from './api-utils';
import { BaseCrudService } from './base-crud.service';


@Injectable()
export class RolesService extends BaseCrudService<Role> {

  constructor(http: HttpClient) {
    super(http, toURL('v2/acl/v1/roles'));
  }
}
