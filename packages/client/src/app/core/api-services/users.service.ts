import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { MoleculerGetOptions, MoleculerList, MoleculerListOptions } from '../../shared/models/MoleculerWrapper';
import { AccountType, User } from '../../shared/models';
import { toURL } from './api-utils';
import { createHttpParams } from '../../shared/utils';
import { Subject } from 'rxjs';

const BASE_URL = toURL('v2/acl/v1/users');

export interface UsersOptions extends MoleculerListOptions {
  accountType: AccountType;
  onlyActive?: boolean;
}

@Injectable()
export class UsersService {
  private refreshSubject = new Subject<void>();

  public refresh$ = this.refreshSubject.asObservable();

  constructor(private http: HttpClient) { }

  list(options: UsersOptions): Promise<MoleculerList<User>> {
    return this.http.get<MoleculerList<User>>(
      BASE_URL,
      { params: createHttpParams({ ...options }) },
    ).toPromise();
  }

  get(id: string, options: MoleculerGetOptions = {}): Promise<User> {
    return this.http.get<User>(
      `${BASE_URL}/${id}`,
      { params: createHttpParams({ ...options }) },
    ).toPromise();
  }

  async create(user: User): Promise<User> {
    const newUser = await this.http.post<User>(BASE_URL, user).toPromise();
    this.refreshSubject.next();
    return newUser;
  }

  async update(user: User): Promise<User> {
    const updatedUser = await this.http.put<User>(`${BASE_URL}/${user._id}`, user).toPromise();
    this.refreshSubject.next();
    return updatedUser;
  }

  async remove(id: string): Promise<User> {
    const user = await this.http.delete<User>(`${BASE_URL}/${id}`).toPromise();
    this.refreshSubject.next();
    return user;
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
