import { Injectable, NgZone } from '@angular/core';
import { MatSnackBar } from '@angular/material';

@Injectable()
export class ToasterService {

    constructor(private snackBar: MatSnackBar,
                private zone: NgZone) {
    }

    showToaster(msg: string): void {
        this.zone.run(() => {
            this.snackBar.open(msg, 'Fermer', {
                duration: 2000,
            });
        });
    }
}
