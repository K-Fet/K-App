import { Router } from '@angular/router';
import { ToasterService } from './../_services';
import { HttpErrorResponse } from '@angular/common/http';
import { Injectable, ErrorHandler, Injector } from '@angular/core';

@Injectable()
export class ErrorsHandler implements ErrorHandler {

    constructor(
        // Because the ErrorHandler is created before the providers,
        // we’ll have to use the Injector to get them.
        private injector: Injector
    ) { }

    handleError(error: Error | HttpErrorResponse) {
        const toasterService = this.injector.get(ToasterService);
        const router = this.injector.get(Router);

        console.log('Error :)');
        if (error instanceof HttpErrorResponse) {
            // Server or connection error happened
            if (!navigator.onLine) {
                // Handle offline error
                return toasterService.showToaster('Pas de connexion internet', 'Fermer');
            } else {
                switch (error.status) {
                    case 401:
                        router.navigate(['/login']);
                        return toasterService.showToaster('Opération non autorisée, redirection ...', 'Fermer');
                    case 404:
                        return toasterService.showToaster('Appel serveur inconnu', 'Fermer');
                }
            }
        } else {
            // TODO: Handle Client Error (Angular Error, ReferenceError...)
        }

        // Log the error anyway
        console.error('Server error happens: ', error);
    }
}
