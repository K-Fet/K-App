import { Observable } from 'rxjs/Observable';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { SpecialAccount } from '../_models/index';

import 'rxjs/add/operator/catch';

@Injectable()
export class SpecialAccountService {

    constructor(private http: HttpClient) { }

    getAll(): Observable<Array<SpecialAccount>> {
        return this.http.get<Array<SpecialAccount>>('/api/specialaccounts');
    }

    getById(id: number): Observable<SpecialAccount> {
        return this.http.get<SpecialAccount>(`/api/specialaccounts/${id}`);
    }

    create(specialAccount: SpecialAccount, code: Number): Observable<SpecialAccount> {
        return this.http.post<SpecialAccount>('/api/specialaccounts', { specialAccount, code });
    }

    update(specialAccount: SpecialAccount, code: Number): Observable<SpecialAccount> {
        const id = specialAccount.id;
        delete specialAccount.id;
        const body = { specialAccount, code };

        return this.http.put<SpecialAccount>(`/api/specialaccounts/${id}`, body);
    }

    delete(id: Number, code: Number): Observable<SpecialAccount> {
        const options = {
            body: {
                code
            }
        };

        return this.http.request<SpecialAccount>('DELETE', `/api/specialaccounts/${id}`, options);
    }
}
