import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AccountType, User } from '../../shared/models';
import * as jwtDecode from 'jwt-decode';
import { NgxPermissionsService, NgxRolesService } from 'ngx-permissions';
import { ROLES } from '../../constants';
import { BehaviorSubject } from 'rxjs';
import { environment } from '../../../environments/environment';
import { toURL } from './api-utils';
import { clearBugsnagUser, setBugsnagUser } from '../bugsnag-client';
import { UsersService } from './users.service';

const BASE_URL = toURL('v2/acl/v1/auth');

@Injectable()
export class AuthService {

  $currentUser: BehaviorSubject<User>;

  // Suppose the user is already logged in
  // Prevent a redirection
  isLoggedIn = true;

  constructor(private http: HttpClient,
    private ngxPermissionsService: NgxPermissionsService,
    private usersService: UsersService,
    private ngxRolesService: NgxRolesService) { }

  async initializeAuth(): Promise<void> {
    this.$currentUser = new BehaviorSubject<User>({
      accountType: AccountType.GUEST,
      account: null,
    });

    const currentUser = {
      ...JSON.parse(localStorage.getItem('currentUser')),
      ...JSON.parse(sessionStorage.getItem('currentUser')),
    };

    if (!currentUser.jwt) return;

    const jwtDecoded = jwtDecode(currentUser.jwt);

    // If the token expire in less than 12 hours,
    // disconnect the user to prevent being disturbed during his navigation
    if (Date.now() >= (jwtDecoded.exp * 1000 - 3600000)) return this.clearUser();

    try {
      await this.reloadCurrentUser();
    } catch (e) {
      console.error('Error during initializeAuth: ', e);
      this.clearUser();
    }
  }

  async login(email: string, password: string, rememberMe: number): Promise<void> {
    const jwt = await this.http.post<string>(`${BASE_URL}/login`, {
      email,
      password,
      rememberMe,
    })
      .toPromise();

    this.saveUser({ jwt }, (rememberMe >= environment.JWT_DAY_EXP_LONG));

    await this.reloadCurrentUser();
  }

  async logout(): Promise<void> {
    try {
      await this.http.get(`${BASE_URL}/logout`).toPromise();
    } catch (e) {
      // ignore
    }

    this.clearUser();
  }

  private clearUser(): void {
    clearBugsnagUser();
    this.$currentUser.next({
      accountType: AccountType.GUEST,
      account: null,
    });
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

  async reloadCurrentUser(): Promise<void> {
    const user = await this.usersService.me();

    this.isLoggedIn = true;

    this.$currentUser.next(user);
    this.ngxRolesService.addRole(user.accountType, ['']);

    setBugsnagUser(this.$currentUser.getValue());
    this.managePermissionAndRole(user.permissions);
  }
}
