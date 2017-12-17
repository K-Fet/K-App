import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { catchError, map, tap } from 'rxjs/operators';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import 'rxjs/add/operator/map';

@Injectable()
export class LoginService {

  isLoggedIn = false;

  constructor(private http: HttpClient) { }

  login(email: string, password: string) {
    this.isLoggedIn = true;
    return this.http.post('/api/auth/login', {email, password});
  }

  logout() {
    localStorage.removeItem('currentUser');
  }
}
