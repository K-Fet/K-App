import { Injectable } from '@angular/core';
import { Product } from '../../products/product.model';
import { Article } from '../article';
import { Shelf } from '../../shelves/shelf.model';
import { Provider } from '../../providers/provider.model';
import { StockEvent } from '../../stock-events/stock-events.model';

import { ShelvesService } from '../../api-services/shelves.service';
import { ProductsService } from '../../api-services/products.service';
import { ProvidersService } from '../../api-services/providers.service';
import { StockEventsService } from '../../api-services/stock-events.service';

import { Router } from '@angular/router';
import { ToasterService } from '../../../core/services/toaster.service';
import { MoleculerListOptions } from 'src/app/shared/models/MoleculerWrapper';
import { MatDialog } from '@angular/material/dialog';
import { OptionsDialogComponent } from '../options-dialog/options-dialog.component';




@Injectable()

export class ProductsSubmitService {

    BASE_PRODUCT = {} as Product;
    BASE_STOCKEVENT = {} as StockEvent;
    BASE_MOLECULERLISTOPTIONS = {} as MoleculerListOptions;

    public automatiqueShelfAssignment = false;

    shelvesInDB: Shelf[];
    providersInDB: Provider[];
    productsInDB: Product[];
    stockEventsInDB: StockEvent[];

    constructor( private productsService: ProductsService,
                 private stockEventsService: StockEventsService,
                 private providersService: ProvidersService,
                 private shelvesService: ShelvesService,
                 private toasterService: ToasterService,
                 private router: Router, 
                 private readonly dialog: MatDialog,
               ){
    }

    async submitProducts(articles: Article[], provider: string): Promise<void> {
        this.automatiqueShelfAssignment = false;

        await this.setProductsInDB();
        this.shelvesInDB = await this.shelvesService.listAll();
        
        this.providersInDB = await this.providersService.listAll();
        
        await Promise.all(articles.map(async article => {
            if(!this.productsInDB.some((prod) => prod.name === article.name)){
                const productToAdd = await this.getProductFromArticle(article, provider);
                await this.productsService.create(productToAdd);
                this.productsInDB.push(productToAdd);
                this.toasterService.showToaster("Le produit " + article.name + " est ajouté à la DB");
            }
        }));
        this.router.navigate(['/inventory-management/products']);
        return Promise.resolve();
    }

    async getProductFromArticle(
        article: Article,
        provider: string,
        ): Promise<Product> {
        const product = this.BASE_PRODUCT;
        const shelves = this.shelvesInDB;

        let oneShelfName: string;
        if(article.name.indexOf("FUT")>0) oneShelfName = "Pressions";
        else if(article.name.indexOf("SIROP")>0) oneShelfName = "Sirops";
        else if(article.name.indexOf("VC")>0 ||article.name.indexOf("VP")>0 ||article.name.indexOf("12X")>0 ||article.name.indexOf("24X")>0) oneShelfName = "Bouteilles";
        else oneShelfName = "Autre";

        const oneShelf: Shelf = shelves.find(shelf => shelf.name === oneShelfName);
            
        if(!this.automatiqueShelfAssignment){
            const dialogRef = this.dialog.open(OptionsDialogComponent, {
                data: {
                    shelves: true,
                    shelf: oneShelf,
                    productName: article.name
                }
            });
            const result = await dialogRef.afterClosed().toPromise();
            if(result){
                product.shelf = result.shelf;
                this.automatiqueShelfAssignment = result.stopDialog;
            }
            else {
                product.shelf = oneShelf._id;
            }
        }
        else {
            product.shelf = oneShelf._id;
        }
        product.name = article.name;
        product.provider = provider; 
        product.conversions = [];

        return product;
    }

    async submitStockEvents(articles: Article[], eventType: string): Promise<void> {
        await this.setProductsInDB();
        await this.setStockEventsInDB();
        const allNotInDb = articles.some((art) => {
            const productId = this.getProductId(art.name,this.productsInDB);
            if(productId === undefined) return true;
        })

        if(allNotInDb){
            this.toasterService.showToaster("Erreur: Tous les produits ne sont pas présent dans la BD");
        } else {
            await Promise.all(articles.map( async article => {
                const productId = this.getProductId(article.name,this.productsInDB);
                //Check that the event does not exist in db
                const eventExist = this.stockEventsInDB.some(evt => {
                    const oneDate = new Date(evt.date);
                    return (productId === evt.product && oneDate.getDate() === article.date.getDate() && oneDate.getMonth() === article.date.getMonth() && oneDate.getFullYear() === article.date.getFullYear());
                });
                if(!eventExist){
                    //Create Event in db   
                    const eventToAdd = this.getStockEventFromArticle(article,productId, eventType);
                        if(!isNaN(article.quantity)){  //Treat some exceptions
                        await this.stockEventsService.create(eventToAdd);
                    }
                    //update DB
                    this.stockEventsInDB.push(eventToAdd);
                    this.toasterService.showToaster("Evènement créé avec succès");
                }
            }));
        }
        this.router.navigate(['/inventory-management/stock-events']);
        return Promise.resolve();
    }

    getStockEventFromArticle(
        article: Article,
        productId: string,
        eventType: string,
        ): StockEvent {
        const stockEvent = this.BASE_STOCKEVENT;
        stockEvent.product = productId;
        stockEvent.diff = article.quantity; 
        stockEvent.date = article.date;
        stockEvent.type = eventType;
        return stockEvent;
    }

    getProductId(productName: string, products: Product[]): string{
        const product = products.find( prod => prod.name === productName);
        return product._id;
    }

    async setProductsInDB(): Promise<void>{ 
        this.productsInDB = await this.productsService.listAll();
    }

    async setStockEventsInDB(): Promise<void>{ //TODO FILTER by date
        const pageSize = 100;
        const events = await this.stockEventsService.list({
            pageSize: pageSize,
        });
        this.stockEventsInDB = events.rows;
    }
   
}
