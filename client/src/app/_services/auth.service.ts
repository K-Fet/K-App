import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ConnectedUser } from '../_models';
import * as jwt_decode from 'jwt-decode';
import { NgxPermissionsService, NgxRolesService } from 'ngx-permissions';
import { Router } from '@angular/router';
import { ROLES } from '../_helpers/roles';
import { BehaviorSubject, Observable } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';

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
    if (localStorage.getItem('currentUser')) {
      const currentUser = JSON.parse(localStorage.getItem('currentUser'));
      if (currentUser.jwt) {
        const jwtDecoded = jwt_decode(currentUser.jwt);
        if (Date.now() < jwtDecoded.exp * 1000) {
          this.managePermissionAndRole(jwtDecoded.permissions);

          // Update /me
          this.me().subscribe();

          // Refresh the token after 50ms to prevent other call.
          setTimeout(
            () => {
              this.refresh().subscribe();
            },
            50,
          );
        } else {
          this.clearUser();
        }
      }
    }
  }

  login(username: string, password: string): Observable<any> {
    return this.http.post('/api/auth/login', { username, password })
      .pipe(tap((jwt: { jwt: String }) => {
        this.saveUser(jwt);
        this.me().subscribe();
        const jwtDecoded = jwt_decode(jwt.jwt);
        this.managePermissionAndRole(jwtDecoded.permissions);

        // Refresh token every 45 minutes
        setTimeout(
          () => {
            this.refresh().subscribe();
          },
          45 * 60 * 60 * 1000,
        );
      }));
  }

  logout(): Observable<any> {
    return this.http.get('/api/auth/logout')
      .pipe(tap(this.clearUser.bind(this)));
  }

  refresh(): Observable<any> {
    return this.http.get('/api/auth/refresh')
      .pipe(
        tap((newJWT: { jwt: String }) => {
          if (newJWT) {
            this.saveUser(newJWT);
            const jwtDecoded = jwt_decode(newJWT.jwt);
            this.managePermissionAndRole(jwtDecoded.permissions);

            // Refresh token every 45 minutes
            setTimeout(
              () => {
                this.refresh().subscribe();
              },
              45 * 60 * 60 * 1000,
            );
          }
        }),
        catchError((err) => {
          this.clearUser();
          return Observable.throw(err);
        }),
      );
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
    if (localStorage.getItem('currentUser')) {
      localStorage.removeItem('currentUser');
    }
    this.router.navigate(['/']);
  }

  private saveUser(jwt): void {
    localStorage.setItem('currentUser', JSON.stringify(jwt));
  }

  private managePermissionAndRole(permissions: string[]): void {
    this.ngxPermissionsService.addPermission(permissions);
    ROLES.forEach((ROLE) => {
      if (permissions.filter(perm => ROLE.permissions.includes(perm)).length === ROLE.permissions.length) {
        this.ngxRolesService.addRole(ROLE.name, ROLE.permissions);
      }
    });
  }

  me(): Observable<any> {
    return this.http.get<ConnectedUser>('/api/me')
      .pipe(
        tap((connectedUser) => {
          if (connectedUser.barman) {
            this.$currentUser.next(new ConnectedUser({
              accountType: 'Barman',
              username: connectedUser.barman.connection.username,
              createdAt: connectedUser.barman.createdAt,
              barman: connectedUser.barman,
            }));
            this.ngxRolesService.addRole('BARMAN', ['']);
          } else if (connectedUser.specialAccount) {
            this.$currentUser.next(new ConnectedUser({
              accountType: 'SpecialAccount',
              username: connectedUser.specialAccount.connection.username,
              createdAt: connectedUser.specialAccount.createdAt,
              specialAccount: connectedUser.specialAccount,
            }));
            this.ngxRolesService.addRole('SPECIAL_ACCOUNT', ['']);
          }
        }),
      );
  }

  resetPassword(username: String): Observable<any> {
    return this.http.post('/api/auth/reset-password', { username });
  }
}
