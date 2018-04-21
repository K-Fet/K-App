import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { ConnectedUser } from '../_models';
import 'rxjs/add/observable/throw';
import 'rxjs/add/operator/catch';
import { Observable } from 'rxjs';

@Injectable()
export class MeService {

    constructor(private http: HttpClient) { }

    put(connectedUser: ConnectedUser): Observable<any> {
        let body;
        if (connectedUser.isBarman()) {
            body = {
                barman: connectedUser.barman,
            };
            delete body.barman.id;
        } else {
            body = {
                specialAccount: connectedUser.specialAccount,
            };
            delete body.specialAccount.id;
        }

        return this.http.put('/api/me', body);
    }
}
