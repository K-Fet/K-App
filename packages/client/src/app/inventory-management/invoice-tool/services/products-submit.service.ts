import { Injectable } from '@angular/core';
import { Product } from '../../products/product.model';
import { Article } from '../article';
import { Shelf } from '../../shelves/shelf.model';
import { Provider } from '../../providers/provider.model';

import { ShelvesService } from '../../api-services/shelves.service';
import { ProductsService } from '../../api-services/products.service';
import { ProvidersService } from '../../api-services/providers.service';

import { Router } from '@angular/router';
import { ToasterService } from '../../../core/services/toaster.service';
import { MoleculerListOptions } from 'src/app/shared/models/MoleculerWrapper';



@Injectable()

export class ProductsSubmit {

    BASE_PRODUCT = {} as Product;
    BASE_MOLECULERLISTOPTIONS = {} as MoleculerListOptions;

    constructor( private productsService: ProductsService,
                 private providersService: ProvidersService,
                 private shelvesService: ShelvesService,
                 private toasterService: ToasterService,
                 private router: Router, ){
    }

    async submitProducts(articles: Article[]): Promise<void> {

        const options =  this.BASE_MOLECULERLISTOPTIONS;
        
        for(let j=0; j<articles.length; j++){
            //Check that the product does not exist in db

            options.pageSize = (await this.productsService.list()).total;
            const exist = await this.productsService.list(options).then(function(value){
                for(let i=0; i<value.rows.length; i++){
                    if(value.rows[i].name === articles[j].name){
                        return true;
                    }  
                }
                return false;
            });
            if(!exist){
            //Create Product in db
                await this.productsService.create(await this.getProductFromArticle(articles[j]).then(
                    function(value){
                        return value;
                    }))
                this.toasterService.showToaster("Le produit " + articles[j].name + "est ajouté à la DB");
            }
        }
        this.router.navigate(['/inventory-management/products']);
        return Promise.resolve();
    }

    async getProductFromArticle(
        article: Article,
        ): Promise<Product> {
        const product = this.BASE_PRODUCT;
        const options = this.BASE_MOLECULERLISTOPTIONS;
       
        let oneShelf: Shelf;
        let oneShelfName;
        if(article.name.indexOf("FUT")>0) oneShelfName = "Pressions";
        else if(article.name.indexOf("SIROP")>0) oneShelfName = "Sirops";
        else if(article.name.indexOf("VC")>0 ||article.name.indexOf("VP")>0 ||article.name.indexOf("12X")>0 ||article.name.indexOf("24X")>0) oneShelfName = "Bouteilles";
        else oneShelfName = "Autre";

        options.pageSize = (await this.shelvesService.list()).total;
        await this.shelvesService.list(options).then(function(value){
            for(let i=0; i<value.rows.length; i++){
                if(value.rows[i].name == oneShelfName){
                    oneShelf = value.rows[i];
                    break;
                }
            }
        });

        let oneProvider: Provider;
        options.pageSize = (await this.providersService.list()).total;
        await this.providersService.list(options).then(function(value){
            for(let i=0; i<value.rows.length; i++){
                if(value.rows[i].name == "France Boissons"){
                    oneProvider = value.rows[i];
                    break;
                }
            }
        });

        product.name = article.name;
        product.provider = oneProvider._id; 
        product.shelf = oneShelf._id;
        product.conversions = [];
        return product;
    }

}
