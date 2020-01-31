/* eslint-disable @typescript-eslint/no-explicit-any */
import { Injectable } from '@angular/core';
import {
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
  HttpResponse,
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { LoaderService } from './services/loader.service';
import { finalize, tap } from 'rxjs/operators';

const ISO_8601 = /^\d{4}-\d\d-\d\dT\d\d:\d\d:\d\d(\.\d+)?(([+-]\d\d:\d\d)|Z)?$/;

const isIso8601 = (value): boolean => typeof value === 'string' && ISO_8601.test(value);

function convertToDate(body: any): void {
  if (body === null || body === undefined) return body;
  if (typeof body !== 'object') return body;

  for (const key of Object.keys(body)) {
    const value = body[key];
    if (isIso8601(value)) {
      body[key] = new Date(value);
    } else if (typeof value === 'object') {
      convertToDate(value);
    }
  }
}

@Injectable()
export class RequestInterceptor implements HttpInterceptor {

  constructor(private loaderService: LoaderService) { }

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    let forwardRequest = request;
    this.loaderService.show();
    const currentUser = {
      ...JSON.parse(localStorage.getItem('currentUser')),
      ...JSON.parse(sessionStorage.getItem('currentUser')),
    };
    if (currentUser.jwt) {
      forwardRequest = request.clone({
        setHeaders: {
          Authorization: `Bearer ${currentUser.jwt}`,
        },
      });
    }
    return next.handle(forwardRequest).pipe(
      tap((event: HttpEvent<any>) => {
        if (event instanceof HttpResponse) {
          const body = event.body;
          convertToDate(body);
        }
      }),
      finalize(() => this.loaderService.hide()),
    );
  }
}
