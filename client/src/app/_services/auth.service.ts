import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ConnectedUser, Permission } from '../_models';
import * as jwt_decode from 'jwt-decode';
import { NgxPermissionsService, NgxRolesService } from 'ngx-permissions';
import { Router } from '@angular/router';
import { ROLES } from '../_helpers/roles';
import { BehaviorSubject, Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable()
export class AuthService {

  $currentUser: BehaviorSubject<ConnectedUser>;

  constructor(private http: HttpClient,
              private ngxPermissionsService: NgxPermissionsService,
              private ngxRolesService: NgxRolesService,
              private router: Router) {
    this.$currentUser = new BehaviorSubject<ConnectedUser>(new ConnectedUser({
      accountType: 'Guest',
      createdAt: new Date(),
    }));
    const currentUser = {
      ...JSON.parse(localStorage.getItem('currentUser')),
      ...JSON.parse(sessionStorage.getItem('currentUser')),
    };
    if (currentUser.jwt) {
      const jwtDecoded = jwt_decode(currentUser.jwt);
      if (Date.now() < (jwtDecoded.exp * 1000 - 3600000)) { // Expiration minus 12 hours
        this.me().subscribe();
      } else {
        this.clearUser();
      }
    }
  }

  login(username: string, password: string, rememberMe: Number): Observable<any> {
    return this.http.post('/api/auth/login', { username, password, rememberMe })
      .pipe(tap((jwt: { jwt: String, permissions: Permission }) => {
        this.saveUser(jwt, (rememberMe >= 30));
        this.me().subscribe();
      }));
  }

  logout(): Observable<any> {
    return this.http.get('/api/auth/logout')
      .pipe(tap(this.clearUser.bind(this)));
  }

  definePassword(username: String, password: String, passwordToken: String, oldPassword: String): Observable<any> {
    return this.http.put('api/auth/reset-password', {
      username,
      password,
      passwordToken,
      oldPassword,
    });
  }

  verifyUsername(userId: Number, username: String, password: String, usernameToken: String): Observable<any> {
    return this.http.post('api/auth/username-verification', {
      userId,
      username,
      password,
      usernameToken,
    });
  }

  cancelEmailUpdate(userId: Number, username: String) {
    return this.http.post('api/auth/cancel-username-verification', {
      userId,
      username,
    });
  }

  private clearUser(): void {
    this.$currentUser.next(new ConnectedUser({
      accountType: 'Guest',
      createdAt: new Date(),
    }));
    this.ngxPermissionsService.flushPermissions();
    this.ngxRolesService.flushRoles();
    if (localStorage.getItem('currentUser')) localStorage.removeItem('currentUser');
    if (sessionStorage.getItem('currentUser')) sessionStorage.removeItem('currentUser');
    this.router.navigate(['/']);
  }

  private saveUser(jwt, rememberMe): void {
    if (rememberMe) localStorage.setItem('currentUser', JSON.stringify(jwt));
    else sessionStorage.setItem('currentUser', JSON.stringify(jwt));
  }

  private managePermissionAndRole(permissions: string[]): void {
    this.ngxPermissionsService.addPermission(permissions);
    ROLES.forEach((ROLE) => {
      if (permissions.filter(perm => ROLE.permissions.includes(perm)).length
        === ROLE.permissions.length) {
        this.ngxRolesService.addRole(ROLE.name, ROLE.permissions);
      }
    });
  }

  me(): Observable<any> {
    return this.http.get<{ user: ConnectedUser, permissions: Permission[] }>('/api/me')
      .pipe(
        tap((res) => {
          if (res.user.barman) {
            this.$currentUser.next(new ConnectedUser({
              accountType: 'Barman',
              username: res.user.barman.connection.username,
              createdAt: res.user.barman.createdAt,
              barman: res.user.barman,
            }));
            this.ngxRolesService.addRole('BARMAN', ['']);
          } else if (res.user.specialAccount) {
            this.$currentUser.next(new ConnectedUser({
              accountType: 'SpecialAccount',
              username: res.user.specialAccount.connection.username,
              createdAt: res.user.specialAccount.createdAt,
              specialAccount: res.user.specialAccount,
            }));
            this.ngxRolesService.addRole('SPECIAL_ACCOUNT', ['']);
          }
          this.managePermissionAndRole(res.permissions);
        }),
      );
  }

  resetPassword(username: String): Observable<any> {
    return this.http.post('/api/auth/reset-password', { username });
  }
}
