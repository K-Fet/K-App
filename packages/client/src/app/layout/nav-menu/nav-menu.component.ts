import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { AccountType, isUserBarman, isUserGuest, isUserServiceAccount, User } from '../../shared/models';
import { NgxPermissionsService, NgxRolesService } from 'ngx-permissions';
import { AuthService } from '../../core/api-services/auth.service';
import { Router } from '@angular/router';

interface Link {
  name: string;
  route: string;
  permissions?: string[];
  accountType?: string;
}

interface SubMenu {
  name?: string;
  links: Link[];
  accountType?: AccountType[];
}

const NAV_MENUS: SubMenu[] = [
  { links: [{ name: 'Accueil', route: '/home' }] },
  {
    name: 'Services',
    links: [
      { name: 'Planning', route: '/services/services-explorer', permissions: ['services.read'] },
      {
        name: 'Ouvrir les services',
        route: '/services/open-services',
        permissions: ['TEMPLATE_MANAGER'],
      },
      {
        name: 'Liste des services',
        route: '/services/services-manager',
        permissions: ['SERVICE_MANAGER'],
      },
    ],
  },
  { links: [{ name: 'Adhérents', route: '/members', permissions: ['members.read'] }] },
  { links: [{ name: 'Utilisateurs', route: '/acl/users', permissions: ['users.read'] }] },
  { links: [{ name: 'Kommissions', route: '/kommissions', permissions: ['kommissions.read'] }] },
  { links: [{ name: 'Roles', route: '/acl/roles', permissions: ['roles.read'] }] },
  {
    links: [{
      name: 'Templates',
      route: '/services/templates',
      permissions: ['services-templates.read'],
    }],
  },
  {
    name: 'Gestion des stocks',
    accountType: [AccountType.BARMAN, AccountType.SERVICE],
    links: [
      { name: 'Fournisseurs', route: '/inventory-management/providers' },
      { name: 'Produits', route: '/inventory-management/products' },
      { name: 'Rayons', route: '/inventory-management/shelves' },
    ],
  },
];

@Component({
  selector: 'app-nav-menu',
  templateUrl: './nav-menu.component.html',
})
export class NavMenuComponent implements OnInit {

  menu: SubMenu[] = NAV_MENUS;
  user: User;

  @Output() onNavigate = new EventEmitter<Link>();

  constructor(
    private ngxPermissionsService: NgxPermissionsService,
    private ngxRolesService: NgxRolesService,
    private authService: AuthService,
    private router: Router,
  ) { }

  ngOnInit() {
    this.authService.$currentUser.subscribe((user) => {
      this.user = user;
    });
  }

  async onClick(link: Link) {
    await this.router.navigate([link.route]);
    this.onNavigate.emit(link);
  }

  isVisible(subMenu: SubMenu): boolean {
    if (subMenu.accountType) {
      if (isUserGuest(this.user) && !subMenu.accountType.includes(AccountType.GUEST)) return false;
      if (isUserBarman(this.user) && !subMenu.accountType.includes(AccountType.BARMAN)) return false;
      if (isUserServiceAccount(this.user) && !subMenu.accountType.includes(AccountType.SERVICE)) return false;
    }

    const allPerms = [
      ...Object.keys(this.ngxPermissionsService.getPermissions()),
      ...Object.keys(this.ngxRolesService.getRoles()),
    ];

    for (const link of subMenu.links) {
      if (!link.permissions) return true;
      for (const perm of link.permissions) {
        if (allPerms.includes(perm)) return true;
      }
    }
    return false;
  }

}
