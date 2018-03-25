import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Template } from '../_models/index';
import { Observable } from 'rxjs/Observable';

@Injectable()
export class TemplateService {

    constructor(private http: HttpClient) { }

    getAll() {
        return this.http.get<Template>('/api/services/template');
    }

    getAllArray() {
        return this.http.get<Template[]>('/api/services/templates');
    }
}
