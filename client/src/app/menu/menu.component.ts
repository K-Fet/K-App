import { Observable } from 'rxjs/Observable';
import { MediaMatcher } from '@angular/cdk/layout';
import { ChangeDetectorRef, OnDestroy, Component, OnInit, ViewChild } from '@angular/core';
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
    sidenavQuery: MediaQueryList;
    user: ConnectedUser;

    private _mobileQueryListener: () => void;
    private _sidebavQueryListener: () => void;

    @ViewChild('snav') public sideNav: MatSidenav;

    constructor(private authService: AuthService,
                private toasterService: ToasterService,
                changeDetectorRef: ChangeDetectorRef,
                media: MediaMatcher) {
        this.mobileQuery = media.matchMedia('(max-width: 599px)');
        this.sidenavQuery = media.matchMedia('(max-width: 1480px)');
        this._mobileQueryListener = () => changeDetectorRef.detectChanges();
        this._sidebavQueryListener = () => changeDetectorRef.detectChanges();
        this.mobileQuery.addListener(this._mobileQueryListener);
        this.sidenavQuery.addListener(this._mobileQueryListener);
    }

    logout() {
        this.authService.logout().subscribe(() => {
            this.toasterService.showToaster('Déconnexion réussie');
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
