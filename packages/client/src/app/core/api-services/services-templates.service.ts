import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ServicesTemplate } from '../../shared/models';
import { toURL } from './api-utils';
import { BaseCrudService } from './base-crud.service';

@Injectable()
export class ServicesTemplatesService extends BaseCrudService<ServicesTemplate> {
  constructor(http: HttpClient) {
    super(http, toURL('v2/core/v1/services-templates'));
  }
}
