import { Component, Inject, OnInit } from '@angular/core';
import { Member, ConnectedUser } from '../_models/index';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialog } from '@angular/material';
import { FormControl, Validators, FormGroup } from '@angular/forms';
import { LoginService } from '../_services/index';
import { Observable } from 'rxjs/Observable';

@Component({
    selector: 'app-connected-user-dialog',
    templateUrl: './connected-user-dialog.component.html',
})

export class ConnectedUserDialogComponent implements OnInit {

    user: ConnectedUser;

    constructor(public dialogRef: MatDialogRef<ConnectedUserDialogComponent>, private loginService: LoginService ) {
    }

    ngOnInit(): void {
        this.loginService.currentUser.subscribe(user => {
            this.user = user;
        });
    }

    onNoClick(): void {
        this.dialogRef.close();
    }
}
