import { MediaMatcher } from '@angular/cdk/layout';
import { ChangeDetectorRef, Component, OnDestroy, OnInit, ViewChild, ElementRef } from '@angular/core';
import { AuthService, ToasterService } from '../_services';
import { ConnectedUser } from '../_models';
import { MatSidenav } from '@angular/material';
import { NgxPermissionsService, NgxRolesService } from 'ngx-permissions';
import { Router } from '@angular/router';
import * as Hammer from 'hammerjs';

interface Link {
  name: string;
  route: string;
  permissions?: string[];
  accountType?: string;
}

interface SubMenu {
  name?: string;
  links: Link[];
  accountType?: string;
}

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss'],
})

export class MenuComponent implements OnDestroy, OnInit {

  menu: SubMenu[] = [
    {
      links: [
        {
          name: 'Accueil',
          route: '/',
        },
      ],
    },
    {
      accountType: 'guest',
      links: [
        {
          name: 'Présentation',
          route: '/presentation',
        },
      ],
    },
    {
      name: 'Contacts',
      accountType: 'guest',
      links: [
        {
          name: 'Pour un concert',
          route: '/contact/concert',
        },
        {
          name: 'Pour un évenement | soirée',
          route: '/contact/event',
        },
        {
          name: 'Pour un objet perdu',
          route: '/contact/lost',
        },
        {
          name: 'Pour un problème avec le site',
          route: '/contact/website',
        },
      ],
    },
    {
      name: 'Services',
      links: [
        {
          name: 'Planning',
          route: '/services-explorer',
          permissions: ['service:read'],
        },
        {
          name: 'Ouvrir les services',
          route: '/open-services',
          permissions: ['TEMPLATE_MANAGER'],
        },
        {
          name: 'Liste des services',
          route: '/services-manager',
          permissions: ['SERVICE_MANAGER'],
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
          name: 'Templates',
          route: '/templates',
          permissions: ['template:write'],
        },
      ],
    },
    {
      name: 'Contacts',
      accountType: 'connectedUser',
      links: [
        {
          name: 'Pour un problème avec le site',
          route: '/contact/website',
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
              private router: Router,
              changeDetectorRef: ChangeDetectorRef,
              media: MediaMatcher,
              elementRef: ElementRef) {
    this.mobileQuery = media.matchMedia('(max-width: 599px)');
    this.sidenavQuery = media.matchMedia('(max-width: 1480px)');
    this._mobileQueryListener = () => changeDetectorRef.detectChanges();
    this.mobileQuery.addListener(this._mobileQueryListener);
    this.sidenavQuery.addListener(this._mobileQueryListener);

    delete Hammer.defaults.cssProps.userSelect;
    const hammertime = new Hammer(elementRef.nativeElement, {});
    hammertime.on('panright', () => {
      if (!this.user.isGuest()) {
        this.sideNav.open();
      }
    });
    hammertime.on('panleft', () => {
      if (!this.user.isGuest()) {
        this.sideNav.close();
      }
    });
  }

  logout(): void {
    this.authService.logout().subscribe(() => {
      this.toasterService.showToaster('Déconnexion réussie');
      this.router.navigate(['/']);
    });
  }

  ngOnInit(): void {
    this.authService.$currentUser.subscribe((user) => {
      this.user = user;
    });
  }

  ngOnDestroy(): void {
    this.mobileQuery.removeListener(this._mobileQueryListener);
  }

  isVisible(subMenu: SubMenu): boolean {
    if (subMenu.accountType === 'guest' && !this.user.isGuest()) return false;
    if (subMenu.accountType === 'connectedUser' && this.user.isGuest()) return false;
    for (const link of subMenu.links) {
      if (!link.permissions) return true;
      for (const perm of link.permissions) {
        if (Object.keys(this.ngxPermissionsService.getPermissions()).indexOf(perm) !== -1
            || Object.keys(this.ngxRolesService.getRoles()).indexOf(perm) !== -1) {
          return true;
        }
      }
      return false;
    }
  }

  redirectHome(): void {
    this.router.navigate(['/']);
  }
}
