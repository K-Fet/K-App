import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable()
export class ContactService {

  constructor(private http: HttpClient) { }

  send(contactFormName: string, values: Object, token: string): Observable<any> {
    return this.http.post('/api/v1/contact', { contactFormName, values, token });
  }
}
