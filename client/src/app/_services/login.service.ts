import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { catchError, map, tap } from 'rxjs/operators';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { JWT } from '../_models/JWT';
import 'rxjs/add/operator/map';

@Injectable()
export class LoginService {

  isLoggedIn = false;

  constructor(private http: HttpClient) { }

  login(email: string, password: string) {
    this.isLoggedIn = true;
    return this.http.post<JWT>('../api/auth/login', {email, password})
    .map(jwt => {
        if (jwt && jwt.id) {
            localStorage.setItem('currentUser', JSON.stringify(jwt));
        }
        return JWT.fromJSON(jwt);
    });
  }
}
