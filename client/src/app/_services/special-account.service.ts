import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { SpecialAccount } from '../_models';

import 'rxjs/add/operator/catch';
import { Observable } from 'rxjs';

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
        return this.http.post<SpecialAccount>('/api/specialaccounts', { specialAccount: specialAccount, code: code });
    }

    update(specialAccount: SpecialAccount, code: Number): Observable<SpecialAccount> {
        return this.http.put<SpecialAccount>(`/api/specialaccounts/${specialAccount.id}`, { specialAccount, code });
    }

    delete(id: Number, code: Number): Observable<SpecialAccount> {
        return this.http.post<SpecialAccount>(`/api/specialaccounts/${id}/delete`, { code });
    }
}
