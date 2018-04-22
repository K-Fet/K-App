import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Template } from '../_models/index';
import { Observable } from 'rxjs/Observable';

@Injectable()
export class TemplateService {

    constructor(private http: HttpClient) { }

    getAll(): Observable<Array<Template>> {
        // TODO change return type to Template[]
        return this.http.get<Array<Template>>('/api/templates');
    }
}
