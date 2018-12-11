import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ConnectedUser, Permission } from '../../shared/models';
import * as jwt_decode from 'jwt-decode';
import { NgxPermissionsService, NgxRolesService } from 'ngx-permissions';
import { ROLES } from '../../constants';
import { BehaviorSubject, Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { environment } from '../../../environments/environment';

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
      await this.me().toPromise();
    } catch (e) {
      console.error('Error during initializeAuth: ', e);
      this.clearUser();
    }
  }

  login(email: string, password: string, rememberMe: number): Observable<any> {
    return this.http.post('/api/v1/auth/login', { email, password, rememberMe })
      .pipe(tap((jwt: { jwt: string, permissions: Permission }) => {
        this.saveUser(jwt, (rememberMe >= environment.JWT_DAY_EXP_LONG));
        this.me().subscribe();
      }));
  }

  logout(): Observable<any> {
    return this.http.get('/api/v1/auth/logout')
      .pipe(tap(this.clearUser.bind(this)));
  }

  definePassword(email: string, password: string, passwordToken: string, oldPassword: string): Observable<any> {
    if (oldPassword) {
      return this.http.put('api/v1/auth/reset-password', {
        email,
        password,
        passwordToken,
        oldPassword,
      });
    }
    return this.http.put('api/v1/auth/reset-password', {
      email,
      password,
      passwordToken,
    });
  }

  verifyEmail(userId: number, email: string, password: string, emailToken: string): Observable<any> {
    return this.http.post('api/v1/auth/email-verification', {
      userId,
      email,
      password,
      emailToken,
    });
  }

  cancelEmailUpdate(userId: number, email: string) {
    return this.http.post('api/v1/auth/cancel-email-verification', {
      userId,
      email,
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

    this.isLoggedIn = false;
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
    return this.http.get<{ user: ConnectedUser, permissions: Permission[] }>('/api/v1/me')
      .pipe(
        tap(({ user: { barman, specialAccount }, permissions }) => {
          this.isLoggedIn = true;

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
        }),
      );
  }

  resetPassword(email: string): Observable<any> {
    return this.http.post('/api/v1/auth/reset-password', { email });
  }
}
