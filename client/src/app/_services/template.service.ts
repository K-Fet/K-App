import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Template } from '../_models/index';

@Injectable()
export class TemplateService {

    constructor(private http: HttpClient) { }

    getAll() {
        // TODO change return type to Template[]
        return this.http.get<Template>('/api/services/template');
    }
}
