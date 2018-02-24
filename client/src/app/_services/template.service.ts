import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Template } from '../_models/index';

@Injectable()
export class ServiceService {

    constructor(private http: HttpClient) { }

}
