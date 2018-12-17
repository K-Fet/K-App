import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-stock-menu',
  templateUrl: './stock-view.component.html',
  styleUrls: ['./stock-view.component.scss']
})
export class StockViewComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

  pictures = [
    {
      id: 1,
      title: 'La choufffe',
      img: 'https://img.saveur-biere.com/img/p/1458-22221-v4_product_img.jpg'
    },
    {
      id: 2,
      title: 'Ninkasi Blanche',
      img: 'https://shop.ninkasi.fr/449-large_default/ninkasi-blanche.jpg'
    },
    {
      id: 2,
      title: 'Ninkasi Blanche',
      img: 'https://shop.ninkasi.fr/449-large_default/ninkasi-blanche.jpg'
    },
    {
      id: 2,
      title: 'Ninkasi Blanche',
      img: 'https://shop.ninkasi.fr/449-large_default/ninkasi-blanche.jpg'
    },
    {
      id: 2,
      title: 'Ninkasi Blanche',
      img: 'https://shop.ninkasi.fr/449-large_default/ninkasi-blanche.jpg'
    },
    {
      id: 2,
      title: 'Ninkasi Blanche',
      img: 'https://shop.ninkasi.fr/449-large_default/ninkasi-blanche.jpg'
    },
    {
      id: 2,
      title: 'Ninkasi Blanche',
      img: 'https://shop.ninkasi.fr/449-large_default/ninkasi-blanche.jpg'
    },
    {
      id: 2,
      title: 'Ninkasi Blanche',
      img: 'https://shop.ninkasi.fr/449-large_default/ninkasi-blanche.jpg'
    },
  ];

}
