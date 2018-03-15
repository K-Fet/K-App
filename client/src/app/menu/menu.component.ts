import { MediaMatcher } from '@angular/cdk/layout';
import { ChangeDetectorRef, OnDestroy, Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService, ToasterService } from '../_services';
import { ConnectedUser } from '../_models';
import { MatSidenav } from '@angular/material';

interface Link {
    name: String;
    route: String;
    permissions?: Array<String>;
}

interface SubMenu {
    name?: String;
    links: Array<Link>;
}

@Component({
    selector: 'app-menu',
    templateUrl: './menu.component.html',
    styleUrls: ['./menu.component.scss']
})

export class MenuComponent implements OnDestroy, OnInit {

    menu: Array<SubMenu> = [
        {
            links: [
                {
                    name: 'Tableau de bord',
                    route: '/dashboard',
                    permissions: []
                }
            ]
        },
        {
            links: [
                {
                    name: 'Adhérents',
                    route: '/members',
                    permissions: ['member:read']
                }
            ]
        },
        {
            links: [
                {
                    name: 'Barmen',
                    route: '/barmen',
                    permissions: ['barman:read']
                }
            ]
        },
        {
            links: [
                {
                    name: 'Kommissions',
                    route: '/kommissions',
                    permissions: ['kommission:read']
                }
            ]
        },
        {
            links: [
                {
                    name: 'Roles',
                    route: '/roles',
                    permissions: ['roles:read']
                }
            ]
        },
        {
            links: [
                {
                    name: 'Comptes spéciaux',
                    route: '/specialaccounts',
                    permissions: ['specialaccount:read']
                }
            ]
        },
        {
            links: [
                {
                    name: 'Ouvrir les services',
                    route: '/open-services',
                    permissions: ['service:write']
                }
            ]
        }
    ];

    mobileQuery: MediaQueryList;
    router: Router;
    user: ConnectedUser;

    private _mobileQueryListener: () => void;

    @ViewChild('snav') public sideNav: MatSidenav;

    constructor(
        private authService: AuthService,
        private toasterService: ToasterService,
        router: Router,
        changeDetectorRef: ChangeDetectorRef,
        media: MediaMatcher) {
        this.mobileQuery = media.matchMedia('(max-width: 750px)');
        this._mobileQueryListener = () => changeDetectorRef.detectChanges();
        this.mobileQuery.addListener(this._mobileQueryListener);
        this.router = router;
    }

    logout() {
        this.authService.logout().subscribe(res => {
            this.toasterService.showToaster('Déconnexion réussie', 'Fermer');
        }, err => {
            this.toasterService.showToaster(err, 'Fermer');
        });
    }

    ngOnInit(): void {
        this.authService.$currentUser.subscribe(user => {
            this.user = user;
            if (this.user.isGuest) {
                this.sideNav.opened = false;
            }
        });
    }

    ngOnDestroy(): void {
        this.mobileQuery.removeListener(this._mobileQueryListener);
    }

}
