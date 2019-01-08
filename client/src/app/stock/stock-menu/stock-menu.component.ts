import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import { Router } from '@angular/router';

interface Link {
  name: string;
  route: string;
  permissions?: string[];
  accountType?: string;
}

interface StockMenu {
  link: Link;
  icon?: string;
}

const NAV_MENUS: StockMenu[]  = [
  {
    link: {
      name: 'Stocks',
      route: '/stock/view',
    },
    icon: 'assessment'
  },
  {
    link: {
      name:'Commandes',
      route :'/orders'
    },
    icon: 'calendar_today'
  },
  {
    link: {
      name: 'Produits',
      route: '/products'
    },
    icon: 'local_bar'
  },
  {
    link: {
      name: 'Statistiques',
      route: '/stats'
    },
    icon: 'trending_up'
  },
  {
    link: {
      name: 'Faire l\'inventaire',
      route: '/inventory'
    },
    icon: 'check_box'
  },
];

@Component({
  selector: 'app-stock-menu',
  templateUrl: './stock-menu.component.html',
  styleUrls: ['./stock-menu.component.scss']
})
export class StockMenuComponent implements OnInit {

  menu: StockMenu[] = NAV_MENUS;

  constructor(private router: Router) { }

  ngOnInit() {
  }

  @Output() onNavigate = new EventEmitter<Link>();

  async onClick(link: Link) {
    await this.router.navigate([link.route]);
    this.onNavigate.emit(link);
  }

}
