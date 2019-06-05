import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ConnectedUser } from '../../shared/models';
import * as jwt_decode from 'jwt-decode';
import { NgxPermissionsService, NgxRolesService } from 'ngx-permissions';
import { ROLES } from '../../constants';
import { BehaviorSubject } from 'rxjs';
import { environment } from '../../../environments/environment';
import { toURL } from './api-utils';
import { clearBugsnagUser, setBugsnagUser } from '../bugsnag-client';

@Injectable()
export class AuthService {

  $currentUser: BehaviorSubject<ConnectedUser>;

  // Suppose the user is already logged in
  // Prevent a redirection
  isLoggedIn: boolean = true;

  constructor(private http: HttpClient,
              private ngxPermissionsService: NgxPermissionsService,
              private ngxRolesService: NgxRolesService) { }

  async initializeAuth(): Promise<any> {
    this.$currentUser = new BehaviorSubject<ConnectedUser>(new ConnectedUser({
      accountType: 'Guest',
      createdAt: new Date(),
    }));

    const currentUser = {
      ...JSON.parse(localStorage.getItem('currentUser')),
      ...JSON.parse(sessionStorage.getItem('currentUser')),
    };

    if (!currentUser.jwt) return;

    const jwtDecoded = jwt_decode(currentUser.jwt);

    // If the token expire in less than 12 hours,
    // disconnect the user to prevent being disturbed during his navigation
    if (Date.now() >= (jwtDecoded.exp * 1000 - 3600000)) return this.clearUser();

    try {
      await this.me();
    } catch (e) {
      console.error('Error during initializeAuth: ', e);
      this.clearUser();
    }
  }

  async login(email: string, password: string, rememberMe: number): Promise<any> {
    const currentUser = await this.http.post<{ jwt: string }>(toURL('v1/auth/login'), {
      email,
      password,
      rememberMe,
    })
      .toPromise();

    this.saveUser(currentUser, (rememberMe >= environment.JWT_DAY_EXP_LONG));

    await this.me();
  }

  async logout(): Promise<any> {
    try {
      await this.http.get(toURL('v1/auth/logout')).toPromise();
    } catch (e) {}

    this.clearUser();
  }

  definePassword(email: string, password: string, passwordToken: string, oldPassword: string): Promise<any> {
    const body = {
      email,
      password,
      // Change null into undefined
      passwordToken: passwordToken || undefined,
      oldPassword: oldPassword || undefined,
    };
    return this.http.put(toURL('v1/auth/reset-password'), body).toPromise();
  }

  verifyEmail(userId: number, email: string, password: string, emailToken: string): Promise<any> {
    return this.http.post(toURL('v1/auth/email-verification'), {
      userId,
      email,
      password,
      emailToken,
    }).toPromise();
  }

  cancelEmailUpdate(userId: number, email: string): Promise<any> {
    return this.http.post(toURL('v1/auth/cancel-email-verification'), {
      userId,
      email,
    }).toPromise();
  }

  resetPassword(email: string): Promise<any> {
    return this.http.post(toURL('v1/auth/reset-password'), { email }).toPromise();
  }

  private clearUser(): void {
    clearBugsnagUser();
    this.$currentUser.next(new ConnectedUser({
      accountType: 'Guest',
      createdAt: new Date(),
    }));
    this.ngxPermissionsService.flushPermissions();
    this.ngxRolesService.flushRoles();
    if (localStorage.getItem('currentUser')) localStorage.removeItem('currentUser');
    if (sessionStorage.getItem('currentUser')) sessionStorage.removeItem('currentUser');

    this.isLoggedIn = false;
  }

  private saveUser(currentUser, rememberMe): void {
    if (rememberMe) {
      localStorage.setItem('currentUser', JSON.stringify(currentUser));
    } else {
      sessionStorage.setItem('currentUser', JSON.stringify(currentUser));
    }
  }

  private managePermissionAndRole(permissions: string[]): void {
    this.ngxPermissionsService.addPermission(permissions);

    ROLES
      .filter(ROLE => ROLE.permissions.every(p => permissions.includes(p)))
      .forEach(ROLE => this.ngxRolesService.addRole(ROLE.name, ROLE.permissions));
  }

  async me(): Promise<any> {
    const { user, permissions } =
      await this.http.get<{ user: ConnectedUser, permissions: string[] }>(toURL('v1/me')).toPromise();

    this.isLoggedIn = true;
    setBugsnagUser(user);

    const { barman, specialAccount } = user;
    if (barman) {
      this.$currentUser.next(new ConnectedUser({
        barman,
        accountType: 'Barman',
        email: barman.connection.email,
        createdAt: barman.createdAt,
      }));
      this.ngxRolesService.addRole('BARMAN', ['']);
    } else if (specialAccount) {
      this.$currentUser.next(new ConnectedUser({
        specialAccount,
        accountType: 'SpecialAccount',
        email: specialAccount.connection.email,
        createdAt: specialAccount.createdAt,
      }));
      this.ngxRolesService.addRole('SPECIAL_ACCOUNT', ['']);
    }
    this.managePermissionAndRole(permissions);
  }
}
