import { MediaMatcher } from '@angular/cdk/layout';
import { ChangeDetectorRef, Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { AuthService, ToasterService } from '../_services';
import { ConnectedUser } from '../_models';
import { MatSidenav } from '@angular/material';
import { NgxPermissionsService, NgxRolesService } from 'ngx-permissions';

interface Link {
    name: String;
    route: String;
    permissions?: Array<String>;
    accountType?: String;
}

interface SubMenu {
    name?: String;
    links: Array<Link>;
}

@Component({
    selector: 'app-menu',
    templateUrl: './menu.component.html',
    styleUrls: ['./menu.component.scss'],
})

export class MenuComponent implements OnDestroy, OnInit {

    menu: Array<SubMenu> = [
        {
            links: [
                {
                    name: 'Mes services',
                    route: '/dashboard-barman',
                    permissions: ['Barman'],
                },
            ],
        },
        {
            links: [
                {
                    name: 'Adhérents',
                    route: '/members',
                    permissions: ['member:read'],
                },
            ],
        },
        {
            links: [
                {
                    name: 'Barmen',
                    route: '/barmen',
                    permissions: ['barman:read'],
                },
            ],
        },
        {
            links: [
                {
                    name: 'Kommissions',
                    route: '/kommissions',
                    permissions: ['kommission:read'],
                },
            ],
        },
        {
            links: [
                {
                    name: 'Roles',
                    route: '/roles',
                    permissions: ['role:read'],
                },
            ],
        },
        {
            links: [
                {
                    name: 'Comptes spéciaux',
                    route: '/specialaccounts',
                    permissions: ['specialaccount:read'],
                },
            ],
        },
        {
            links: [
                {
                    name: 'Ouvrir les services',
                    route: '/open-services',
                    permissions: ['SERVICE_MANAGER'],
                },
            ],
        },
    ];

    mobileQuery: MediaQueryList;
    sidenavQuery: MediaQueryList;
    user: ConnectedUser;

    private _mobileQueryListener: () => void;

    @ViewChild('snav') public sideNav: MatSidenav;

    constructor(private authService: AuthService,
                private toasterService: ToasterService,
                private ngxPermissionsService: NgxPermissionsService,
                private ngxRolesService: NgxRolesService,
                changeDetectorRef: ChangeDetectorRef,
                media: MediaMatcher) {
        this.mobileQuery = media.matchMedia('(max-width: 599px)');
        this.sidenavQuery = media.matchMedia('(max-width: 1480px)');
        this._mobileQueryListener = () => changeDetectorRef.detectChanges();
        this.mobileQuery.addListener(this._mobileQueryListener);
        this.sidenavQuery.addListener(this._mobileQueryListener);
    }

    logout(): void {
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

    isVisible(subMenu: SubMenu): Boolean {
        for (const link of subMenu.links) {
            if (!link.permissions) return true;
            for (const perm of link.permissions) {
                if (Object.keys(this.ngxPermissionsService.getPermissions()).indexOf(perm as string) !== -1
                    || Object.keys(this.ngxRolesService.getRoles()).indexOf(perm as string) !== -1) {
                    return true;
                }
            }
        }
        return false;
    }
}
