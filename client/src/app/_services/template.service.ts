import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Template } from '../_models/index';
import { Observable } from 'rxjs/Observable';

@Injectable()
export class TemplateService {

    constructor(private http: HttpClient) { }

    getAll() {
        return this.http.get<Template[]>('/api/templates');
    }

    getById(id: number) {
        return this.http.get<Template>('/api/templates/' + id);
    }

    create(template: Template) {
        return this.http.post('/api/templates',  template);
    }

    delete(id: Number) {
        return this.http.delete('api/templates/' + id);
    }
}
