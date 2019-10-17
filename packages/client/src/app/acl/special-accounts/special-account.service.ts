import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { SpecialAccount } from '../../shared/models';
import { toURL } from '../../core/api-services/api-utils';

@Injectable()
export class SpecialAccountService {

  constructor(private http: HttpClient) { }

  getAll(): Promise<SpecialAccount[]> {
    return this.http.get<SpecialAccount[]>(toURL('v1/specialaccounts')).toPromise();
  }

  getById(id: number): Promise<SpecialAccount> {
    return this.http.get<SpecialAccount>(toURL(`v1/specialaccounts/${id}`)).toPromise();
  }

  create(specialAccount: SpecialAccount, code: number): Promise<SpecialAccount> {
    return this.http.post<SpecialAccount>(toURL('v1/specialaccounts'), { specialAccount, code }).toPromise();
  }

  update(specialAccount: SpecialAccount, code: number): Promise<SpecialAccount> {
    return this.http.put<SpecialAccount>(toURL(`v1/specialaccounts/${specialAccount.id}`), {
      specialAccount,
      code,
    }).toPromise();
  }

  delete(id: number, code: number): Promise<SpecialAccount> {
    return this.http.post<SpecialAccount>(toURL(`v1/specialaccounts/${id}/delete`), { code }).toPromise();
  }
}
