import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ConnectedUser } from '../../shared/models';
import { toURL } from './api-utils';

@Injectable()
export class MeService {

  constructor(private http: HttpClient) { }

  put(connectedUser: ConnectedUser, code?: number): Promise<any> {
    let body;
    if (connectedUser.isBarman()) {
      body = {
        barman: connectedUser.barman,
      };
    } else {
      body = {
        code,
        specialAccount: connectedUser.specialAccount,
      };
    }

    return this.http.put(toURL('v1/me'), body).toPromise();
  }
}
