import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { MoleculerList, MoleculerListOptions } from '../../shared/models/MoleculerWrapper';
import { User } from '../../shared/models';
import { toURL } from './api-utils';
import { createHttpParams } from '../../shared/utils';

const BASE_URL = toURL('v2/acl/v1/users');

export interface UsersOptions extends MoleculerListOptions {
  accountType: 'SERVICE' | 'BARMAN';
}

@Injectable()
export class UsersService {

  constructor(private http: HttpClient) { }

  list(options: UsersOptions): Promise<MoleculerList<User>> {
    return this.http.get<MoleculerList<User>>(
      BASE_URL,
      { params: createHttpParams({ ...options }) },
    ).toPromise();
  }

  get(id: string): Promise<User> {
    return this.http.get<User>(`${BASE_URL}/${id}`).toPromise();
  }

  async create(user: User): Promise<User> {
    return await this.http.post<User>(BASE_URL, user).toPromise();
  }

  async update(user: User): Promise<User> {
    return await this.http.put<User>(`${BASE_URL}/${user._id}`, user).toPromise();
  }

  async remove(id: string): Promise<User> {
    return await this.http.delete<User>(`${BASE_URL}/${id}`).toPromise();
  }

  me(): Promise<User> {
    return this.http.get<User>(`${BASE_URL}/me`).toPromise();
  }

  definePassword(email: string, password: string, passwordToken: string, oldPassword: string): Promise<{}> {
    const body = {
      email,
      password,
      // Change null into undefined
      passwordToken: passwordToken || undefined,
      oldPassword: oldPassword || undefined,
    };
    return this.http.post(`${BASE_URL}/define-password`, body).toPromise();
  }

  verifyEmail(userId: number, email: string, password: string, emailToken: string): Promise<{}> {
    return this.http.post(`${BASE_URL}/email-verify`, {
      userId,
      email,
      password,
      emailToken,
    }).toPromise();
  }

  cancelEmailUpdate(userId: number, email: string): Promise<{}> {
    return this.http.post(`${BASE_URL}/cancel-email-update`, {
      userId,
      email,
    }).toPromise();
  }

  resetPassword(email: string): Promise<{}> {
    return this.http.post(`${BASE_URL}/reset-password`, { email }).toPromise();
  }
}
