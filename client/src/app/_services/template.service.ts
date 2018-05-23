import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Template } from '../_models/';
import { Observable } from 'rxjs';

@Injectable()
export class TemplateService {

    constructor(private http: HttpClient) { }

    getAll(): Observable<Array<Template>> {
        return this.http.get<Array<Template>>('/api/templates');
    }

    getById(id: number): Observable<Template> {
        return this.http.get<Template>(`/api/templates/${id}`);
    }

    create(template: Template): Observable<Template> {
        return this.http.post<Template>('/api/templates', template);
    }

    update(template: Template): Observable<Template> {
        return this.http.put<Template>(`/api/templates/${template.id}`, template);
    }

    delete(id: Number): Observable<Template> {
        return this.http.post<Template>(`api/templates/${id}/delete`, null);
    }
}
