import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable()
export class ContactService {

  constructor(private http: HttpClient) { }

  send(contactFormName: String, values: Object, token: String): Observable<any> {
    return this.http.post('/api/contact', { contactFormName, values, token });
  }
}
