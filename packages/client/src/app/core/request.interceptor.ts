import { Injectable } from '@angular/core';
import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Observable } from 'rxjs';
import { LoaderService } from './services/loader.service';
import { finalize } from 'rxjs/operators';

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
    return next.handle(forwardRequest).pipe(finalize(() => this.loaderService.hide()));
  }
}
