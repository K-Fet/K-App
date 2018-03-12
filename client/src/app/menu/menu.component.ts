import {MediaMatcher} from '@angular/cdk/layout';
import {ChangeDetectorRef, OnDestroy, Component, OnInit} from '@angular/core';
import { Router } from '@angular/router';
import { LoginService, ToasterService } from '../_services';
import { ConnectedUser } from '../_models';
import { MatDialog } from '@angular/material';
import { ConnectedUserDialogComponent } from '../connected-user-dialog/connected-user-dialog.component';

@Component({
    selector: 'app-menu',
    templateUrl: './menu.component.html',
    styleUrls: ['./menu.component.scss']
})

export class MenuComponent implements OnDestroy, OnInit {

    mobileQuery: MediaQueryList;
    router: Router;
    user: ConnectedUser;

    private _mobileQueryListener: () => void;

    constructor(
        private loginService: LoginService,
        private toasterService: ToasterService,
        public dialog: MatDialog,
        router: Router,
        changeDetectorRef: ChangeDetectorRef,
        media: MediaMatcher) {
        this.mobileQuery = media.matchMedia('(max-width: 750px)');
        this._mobileQueryListener = () => changeDetectorRef.detectChanges();
        this.mobileQuery.addListener(this._mobileQueryListener);
        this.router = router;
    }


    logout() {
        this.loginService.logout().subscribe(res => {
            this.toasterService.showToaster('Déconnexion réussie', 'Fermer');
        }, err => {
            this.toasterService.showToaster(err, 'Fermer');
        });
    }

    openUserInformation(): void {
        this.dialog.open(ConnectedUserDialogComponent, {
            position: {
                top: '60px',
                right: '20px'
            }
        });
    }

    ngOnInit(): void {
        this.loginService.$currentUser.subscribe(user => {
            this.user = user;
        });
    }

    ngOnDestroy(): void {
        this.mobileQuery.removeListener(this._mobileQueryListener);
    }

}
