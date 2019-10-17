import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { toURL } from '../../core/api-services/api-utils';

@Injectable()
export class ContactService {

  constructor(private http: HttpClient) { }

  send(contactFormName: string, values: Object, token: string): Promise<any> {
    return this.http.post(toURL('v1/contact'), { contactFormName, values, token }).toPromise();
  }
}
