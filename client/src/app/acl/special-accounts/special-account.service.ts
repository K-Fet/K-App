import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { SpecialAccount } from '../../shared/models';
import { Observable } from 'rxjs';

@Injectable()
export class SpecialAccountService {

  constructor(private http: HttpClient) { }

  getAll(): Observable<SpecialAccount[]> {
    return this.http.get<SpecialAccount[]>('/api/v1/specialaccounts');
  }

  getById(id: number): Observable<SpecialAccount> {
    return this.http.get<SpecialAccount>(`/api/v1/specialaccounts/${id}`);
  }

  create(specialAccount: SpecialAccount, code: number): Observable<SpecialAccount> {
    return this.http.post<SpecialAccount>('/api/v1/specialaccounts', { specialAccount, code });
  }

  update(specialAccount: SpecialAccount, code: number): Observable<SpecialAccount> {
    return this.http.put<SpecialAccount>(`/api/v1/specialaccounts/${specialAccount.id}`, {
      specialAccount,
      code,
    });
  }

  delete(id: number, code: number): Observable<SpecialAccount> {
    return this.http.post<SpecialAccount>(`/api/v1/specialaccounts/${id}/delete`, { code });
  }
}
