import { Injectable } from '@angular/core';
import { Product } from '../../products/product.model';
import { Article } from '../article';
import { Shelf } from '../../shelves/shelf.model';
import { Provider } from '../providers/provider.model';
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

        const options =  this.BASE_MOLECULERLISTOPTIONS;

        await this.setProductsInDB();

        options.pageSize = (await this.shelvesService.list()).total;
        this.shelvesInDB = await this.shelvesService.list(options).then(function(value){
            return value.rows;
        });
        
        options.pageSize = (await this.providersService.list()).total;
        this.providersInDB = await this.providersService.list(options).then(function(value){
            return value.rows;
        });
        
        for(let j=0; j<articles.length; j++){
            //Check that the product does not exist in db

            let exist = false;
            for(let i=0; i<this.productsInDB.length; i++){
                if(this.productsInDB[i].name === articles[j].name) exist = true;
            }

            if(!exist){
            //Create Product in db
                const productToAdd = await this.getProductFromArticle(articles[j], provider,);
                await this.productsService.create(productToAdd);
                await this.setProductsInDB();
                this.toasterService.showToaster("Le produit " + articles[j].name + " est ajouté à la DB");
            }
        }
        this.router.navigate(['/inventory-management/products']);
        return Promise.resolve();
    }

    async getProductFromArticle(
        article: Article,
        provider: string,
        ): Promise<Product> {
        const product = this.BASE_PRODUCT;
        const shelves = this.shelvesInDB;

        let oneShelf: Shelf;
        let oneShelfName: string;
        if(article.name.indexOf("FUT")>0) oneShelfName = "Pressions";
        else if(article.name.indexOf("SIROP")>0) oneShelfName = "Sirops";
        else if(article.name.indexOf("VC")>0 ||article.name.indexOf("VP")>0 ||article.name.indexOf("12X")>0 ||article.name.indexOf("24X")>0) oneShelfName = "Bouteilles";
        else oneShelfName = "Autre";

        for(let i=0; i<shelves.length; i++){
            if(shelves[i].name === oneShelfName){
                oneShelf = shelves[i];
                break;
            }
        }
        
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
        for(let j=0; j<articles.length; j++){
            const productId = this.getProductId(articles[j].name,this.productsInDB);
            if(productId != undefined){
            //Check that the event does not exist in db
            let exist = false;
                for(let i=0; i<this.stockEventsInDB.length; i++){
                    if(productId === this.stockEventsInDB[i].product){
                        const oneDate = new Date(this.stockEventsInDB[i].date);
                        if(oneDate.getDate() === articles[j].date.getDate() && oneDate.getMonth() === articles[j].date.getMonth() && oneDate.getFullYear() === articles[j].date.getFullYear() ) {
                            exist = true;
                        }
                    }
                }
                if(!exist){
                //Create Event in db
                    
                    const eventToAdd = this.getStockEventFromArticle(articles[j],productId, eventType);
                    if(!isNaN(articles[j].quantity)){  //Treat some exceptions
                        await this.stockEventsService.create(eventToAdd);
                    }
                    //update DB
                    await this.setStockEventsInDB();

                    this.toasterService.showToaster("Evènement créé avec succès");
                }
            }
            else{
                this.toasterService.showToaster("Erreur: Tous les produits ne sont pas présent dans la BD");
                break;
            }
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
        for(let i=0; i<products.length; i++){
            if(products[i].name === productName){
                return products[i]._id
            }
        }
    }

    async setProductsInDB(): Promise<void>{
        const options =  this.BASE_MOLECULERLISTOPTIONS;
        const totalProducts = (await this.productsService.list()).total;
        options.pageSize = 100;  //maximum
        options.page = 0;
        this.productsInDB = [];
        do{
            options.page ++;
            const onePage = await this.productsService.list(options).then(function(value){
                return value.rows;
            });
            for(let i=0; i<onePage.length; i++){
                this.productsInDB.push(onePage[i]);
            }
        }while(totalProducts > options.page * options.pageSize);
        return Promise.resolve();
    }

    async setStockEventsInDB(): Promise<void>{
        const options =  this.BASE_MOLECULERLISTOPTIONS;
        const totalStockEvents = (await this.stockEventsService.list()).total;
        options.pageSize = 100;  //maximum
        options.page = 0;
        this.stockEventsInDB = [];
        do{
            options.page ++;
            const onePage = await this.stockEventsService.list(options).then(function(value){
                return value.rows;
            });
            for(let i=0; i<onePage.length; i++){
                this.stockEventsInDB.push(onePage[i]);
            }
        }while(totalStockEvents > options.page * options.pageSize);
        return Promise.resolve();
    }
   
}
