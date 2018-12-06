import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ConnectedUser } from '../_models';
import { Observable } from 'rxjs';

@Injectable()
export class MeService {

  constructor(private http: HttpClient) { }

  put(connectedUser: ConnectedUser, code?: number): Observable<any> {
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

    return this.http.put('/api/v1/me', body);
  }
}
