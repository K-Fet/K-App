import { ERRORS400 } from './errors.400';
import { Router } from '@angular/router';
import { ToasterService } from './../_services';
import { HttpErrorResponse } from '@angular/common/http';
import { ErrorHandler, Injectable, Injector } from '@angular/core';

@Injectable()
export class ErrorsHandler implements ErrorHandler {
    constructor(
        // Because the ErrorHandler is created before the providers,
        // we’ll have to use the Injector to get them.
        private injector: Injector) {}

    handleError(error: Error | HttpErrorResponse): void {
        const toasterService = this.injector.get(ToasterService);
        const router = this.injector.get(Router);

        if (error instanceof HttpErrorResponse)
            if (!navigator.onLine)
                // Server or connection error happened
                return toasterService.showToaster('Pas de connexion internet');
            else
                switch (error.status) {
                    case 400:
                        return toasterService.showToaster(
                            ERRORS400[error.error.error]
                        );
                    case 401:
                        router.navigate(['/login']);

                        return toasterService.showToaster(
                            'Opération non autorisée, redirection ...'
                        );
                    case 403:
                        return toasterService.showToaster(
                            'Autorisations non suffisante pour effectuer la requête'
                        );
                    case 404:
                        return toasterService.showToaster(
                            'Appel serveur inconnu'
                        );
                    case 500:
                        return toasterService.showToaster(
                            'Erreur serveur (indépendant du client). Merci de vérifier le serveur.'
                        );
                    default:
                        return;
                }
        else {
            // TODO: Handle Client Error (Angular Error, ReferenceError...). Maybe send it to DB in order to manage it.
        }
        // Log the error in the console
        console.error('Server error happens: ', error);
    }
}
