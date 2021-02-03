import { Injectable } from '@angular/core';
import { Product } from '../../products/product.model';
import { Article } from '../article';
import { Shelf } from '../../shelves/shelf.model';
import { Provider } from '../../providers/provider.model';
import { StockEvent, StockEventType } from '../../stock-events/stock-events.model';

import { ProductsService } from '../../api-services/products.service';
import { StockEventsService } from '../../api-services/stock-events.service';

import { Router } from '@angular/router';
import { ToasterService } from '../../../core/services/toaster.service';
import { isSameDay } from 'date-fns';


@Injectable()
export class ProductsSubmitService {
  public automatiqueShelfAssignment = false;

  shelvesInDB: Shelf[];
  providersInDB: Provider[];
  productsInDB: Product[];
  stockEventsInDB: StockEvent[];

  constructor(private productsService: ProductsService,
    private stockEventsService: StockEventsService,
    private toasterService: ToasterService,
    private router: Router,
  ) {
  }

  async submitStockEvents(articles: Article[], eventType: StockEventType): Promise<void> {
    this.productsInDB = await this.productsService.listAll();

    await this.setStockEventsInDB();

    const allNotInDb = articles.some((art) => {
      const productId = this.getProductId(art.name, this.productsInDB);
      if (productId === undefined) return true;
    });

    if (allNotInDb) {
      this.toasterService.showToaster('Erreur: Tous les produits ne sont pas présent dans la BD');
      this.router.navigate(['/inventory-management/stock-events']);
      return;
    }

    const events = articles.filter(article => {
      const productId = this.getProductId(article.name, this.productsInDB);
      //Check that the event does not exist in db
      const eventExist = this.stockEventsInDB.some(evt => {
        const oneDate = new Date(evt.date);
        return productId === evt.product && isSameDay(article.date, oneDate);
      });

      return !eventExist && !isNaN(article.quantity);
    }).map(article => {
      const productId = this.getProductId(article.name, this.productsInDB);
      return {
        product: productId,
        diff: article.quantity,
        date: article.date,
        type: eventType,
      };
    });

    await this.stockEventsService.add(events);
    await this.stockEventsInDB.push(...events);

    this.toasterService.showToaster('Évènements créés avec succès');

    this.router.navigate(['/inventory-management/stock-events']);
  }

  getProductId(productName: string, products: Product[]): string {
    const product = products.find(prod => prod.name === productName);
    return product._id;
  }

  async setStockEventsInDB(): Promise<void> { //TODO FILTER by date
    const events = await this.stockEventsService.list({ pageSize: 100 });
    this.stockEventsInDB = events.rows;
  }
}
