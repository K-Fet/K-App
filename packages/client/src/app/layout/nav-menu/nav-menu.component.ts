import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { AccountType, ConnectedUser } from '../../shared/models';
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
    accountType: [AccountType.GUEST],
    links: [{ name: 'Présentation', route: '/home/presentation' }],
  },
  {
    name: 'Services',
    links: [
      { name: 'Planning', route: '/services/services-explorer', permissions: ['service:read'] },
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
  { links: [{ name: 'Adhérents', route: '/members', permissions: ['member:read'] }] },
  { links: [{ name: 'Barmen', route: '/barmen', permissions: ['barman:read'] }] },
  { links: [{ name: 'Kommissions', route: '/kommissions', permissions: ['kommission:read'] }] },
  { links: [{ name: 'Roles', route: '/acl/roles', permissions: ['role:read'] }] },
  {
    links: [{
      name: 'Comptes spéciaux',
      route: '/acl/special-accounts',
      permissions: ['specialaccount:read'],
    }],
  },
  {
    links: [{
      name: 'Templates',
      route: '/services/templates',
      permissions: ['template:write'],
    }],
  },
  {
    name: 'Gestion des stocks',
    accountType: [AccountType.BARMAN, AccountType.SPECIAL_ACCOUNT],
    links: [
      { 
        name: 'Fournisseurs', 
        route: '/inventory-management/providers',
        permissions: ['inventory-management:providers:list'],
      },
      { 
        name: 'Produits', 
        route: '/inventory-management/products',
        permissions: ['inventory-management:products:list'],
      },
      { 
        name: 'Rayons', 
        route: '/inventory-management/shelves' ,
        permissions: ['inventory-management:shelves:list'],
      },
      { name: 'Evenements', 
        route: '/inventory-management/stock-events', 
        permissions: ['inventory-management:stock-events:list'],
      },
      {
        name: 'Outil StoK-Fêt',
        route: '/inventory-management/inventory-tools',
        permissions: ['inventory-management:invoice-tool']
      },
    ],
  },
  {
    name: 'Contacts',
    accountType: [AccountType.GUEST],
    links: [
      { name: 'Pour un concert', route: '/contact/concert' },
      { name: 'Pour un évenement | soirée', route: '/contact/event' },
      { name: 'Pour un objet perdu', route: '/contact/lost' },
      { name: 'Pour un problème avec le site', route: '/contact/website' },
    ],
  },
  {
    name: 'Contacts',
    accountType: [AccountType.BARMAN, AccountType.SPECIAL_ACCOUNT],
    links: [{ name: 'Pour un problème avec le site', route: '/contact/website' }],
  },
];

@Component({
  selector: 'app-nav-menu',
  templateUrl: './nav-menu.component.html',
})
export class NavMenuComponent implements OnInit {

  menu: SubMenu[] = NAV_MENUS;
  user: ConnectedUser;

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
      if (this.user.isGuest() && !subMenu.accountType.includes(AccountType.GUEST)) return false;
      if (this.user.isBarman() && !subMenu.accountType.includes(AccountType.BARMAN)) return false;
      if (this.user.isSpecialAccount() && !subMenu.accountType.includes(AccountType.SPECIAL_ACCOUNT)) return false;
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
