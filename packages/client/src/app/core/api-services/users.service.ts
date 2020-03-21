import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AccountType, User } from '../../shared/models';
import { toURL } from './api-utils';
import { BaseCrudService } from './base-crud.service';

export type AdditionalUsersOptions = {
  accountType: AccountType;
  onlyActive?: boolean;
}

@Injectable()
export class UsersService extends BaseCrudService<User, AdditionalUsersOptions> {
  constructor(http: HttpClient) {
    super(http, toURL('v2/acl/v1/users'));
  }

  me(): Promise<User> {
    return this.http.get<User>(`${this.baseUrl}/me`).toPromise();
  }

  definePassword(email: string, password: string, passwordToken: string, oldPassword: string): Promise<{}> {
    const body = {
      email,
      password,
      // Change null into undefined
      passwordToken: passwordToken || undefined,
      oldPassword: oldPassword || undefined,
    };
    return this.http.post(`${this.baseUrl}/define-password`, body).toPromise();
  }

  verifyEmail(userId: number, email: string, password: string, emailToken: string): Promise<{}> {
    return this.http.post(`${this.baseUrl}/email-verify`, {
      userId,
      email,
      password,
      emailToken,
    }).toPromise();
  }

  cancelEmailUpdate(userId: number, email: string): Promise<{}> {
    return this.http.post(`${this.baseUrl}/cancel-email-update`, {
      userId,
      email,
    }).toPromise();
  }

  resetPassword(email: string): Promise<{}> {
    return this.http.post(`${this.baseUrl}/reset-password`, { email }).toPromise();
  }
}
