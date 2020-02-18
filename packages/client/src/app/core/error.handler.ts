import { BAD_REQUEST_ERRORS } from '../constants';
import { Router } from '@angular/router';
import { ToasterService } from './services/toaster.service';
import { HttpErrorResponse } from '@angular/common/http';
import { ErrorHandler, Injectable, Injector, isDevMode } from '@angular/core';
import { BugsnagErrorHandler } from '@bugsnag/plugin-angular';
import { bugsnagClient } from './bugsnag-client';

const getErrorFromHttpError = (error: HttpErrorResponse): string => {
  if (error.error.name === 'MoleculerClientError') {
    return BAD_REQUEST_ERRORS[error.error.type] || error.error.message;
  }
  return 'Problème côté client';
};

@Injectable()
export class AppErrorHandler implements ErrorHandler {
  private readonly bugsnag: BugsnagErrorHandler = null;

  constructor(
    // Because the ErrorHandler is created before the providers,
    // we’ll have to use the Injector to get them.
    private injector: Injector,
  ) {
    if (bugsnagClient) {
      this.bugsnag = new BugsnagErrorHandler(bugsnagClient);
    }
  }

  handleError(error: Error | HttpErrorResponse): void {
    const toasterService = this.injector.get(ToasterService);
    const router = this.injector.get(Router);
    let realError = error;

    // Handle case where HttpErrorResponse is wrapped inside promise error
    // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
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
          return toasterService.showToaster(getErrorFromHttpError(realError));
        case 401:
          router.navigate(['/auth/login']);
          return toasterService.showToaster('Opération non autorisée, redirection ...');
        case 403:
          return toasterService.showToaster('Autorisations non suffisante pour effectuer la requête');
        case 404:
          return toasterService.showToaster('Impossible de trouver cet objet');
        case 429:
          return toasterService.showToaster('Trop de requêtes, veuillez attendre quelques minutes.');
        case 500:
          return toasterService.showToaster(
            'Erreur serveur (indépendant du client). Merci de contacter l\'administrateur.');
        default:
          return toasterService.showToaster('Erreur inconnue. Merci de contacter l\'administrateur.');
      }
    }

    this.forward(error);
  }

  private forward(error: Error | HttpErrorResponse): void {
    if (isDevMode()) {
      console.error('Client error happens: ', error);
    } else if (this.bugsnag) {
      this.bugsnag.handleError(error);
    }
  }
}
