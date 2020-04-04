import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Kommission } from '../../shared/models';
import { toURL } from './api-utils';
import { BaseCrudService } from './base-crud.service';

@Injectable()
export class KommissionsService extends BaseCrudService<Kommission> {

  constructor(http: HttpClient) {
    super(http, toURL('v2/acl/v1/kommissions'));
  }
}
