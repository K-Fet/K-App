import { BAD_REQUEST_ERRORS } from '../constants';
import { Router } from '@angular/router';
import { ToasterService } from './services/toaster.service';
import { HttpErrorResponse } from '@angular/common/http';
import { ErrorHandler, Injectable, Injector, isDevMode } from '@angular/core';

@Injectable()
export class AppErrorHandler implements ErrorHandler {

  constructor(
    // Because the ErrorHandler is created before the providers,
    // we’ll have to use the Injector to get them.
    private injector: Injector,
  ) { }

  handleError(error: Error | HttpErrorResponse): void {
    const toasterService = this.injector.get(ToasterService);
    const router = this.injector.get(Router);
    let realError = error;

    // Handle case where HttpErrorResponse is wrapped inside promise error
    // @ts-ignore
    if (error.promise && error.rejection) realError = error.rejection;

    if (realError instanceof HttpErrorResponse) {
      // Server or connection error happened
      if (!navigator.onLine) {
        // Handle offline error
        return toasterService.showToaster('Pas de connexion internet');
      }
      switch (realError.status) {
        case 400:
          return toasterService.showToaster(BAD_REQUEST_ERRORS[realError.error.error]);
        case 401:
          router.navigate(['/auth/login']);
          return toasterService.showToaster('Opération non autorisée, redirection ...');
        case 403:
          return toasterService.showToaster('Autorisations non suffisante pour effectuer la requête');
        case 404:
          return toasterService.showToaster('Appel serveur inconnu');
        case 429:
          return toasterService.showToaster('Trop de requêtes, veuillez attendre quelques minutes.');
        case 500:
          return toasterService.showToaster(
            'Erreur serveur (indépendant du client). Merci de contacter l\'administrateur.');
        default:
          return toasterService.showToaster('Erreur inconnue. Merci de contacter l\'administrateur.');
      }
    }

    // TODO: Handle Client Error (Angular Error, ReferenceError...). Maybe send it to DB in order to manage it.
    // Log the error in the console if dev mode
    if (isDevMode()) console.error('Client error happens: ', error);
  }
}
