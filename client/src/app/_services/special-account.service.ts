import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { SpecialAccount } from '../_models/index';

import 'rxjs/add/operator/catch';

@Injectable()
export class SpecialAccountService {

    constructor(private http: HttpClient) { }

    getAll() {
        return this.http.get<SpecialAccount[]>('/api/specialaccounts');
    }

    getById(id: number) {
        return this.http.get<SpecialAccount>('/api/specialaccounts/' + id);
    }

    create(specialAccount: SpecialAccount, code:  Number) {
        return this.http.post('/api/specialaccounts', { specialAccount: specialAccount, code: code });
    }

    update(specialAccount: SpecialAccount, code: Number) {
        const id = specialAccount.id;
        delete specialAccount.id;
        const body = { specialAccount: specialAccount, code: code };
        return this.http.put('/api/specialaccounts/' + id, body);
    }

    delete(id: Number, code: Number) {
        const options = {
            body: {
                code: code,
            }
        };
        return this.http.request('DELETE', '/api/specialaccounts/' + id, options);
    }
}
