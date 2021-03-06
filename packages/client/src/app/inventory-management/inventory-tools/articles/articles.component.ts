import { Component, OnInit, ViewChild } from '@angular/core';
import { ArticlesService } from '../services/articles.service';
import { Article } from '../article';
import { Subscription } from 'rxjs';
import { ProductsSubmitService } from '../services/products-submit.service';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { OptionsDialogComponent } from '../options-dialog/options-dialog.component';
import { EditArticleDialogComponent } from './edit-article-dialog/edit-article-dialog.component';
import { ProductsService } from '../../api-services/products.service';
import { Product } from '../../products/product.model';
import { ToasterService } from 'src/app/core/services/toaster.service';


@Component({
  selector: 'validation-dialog',
  templateUrl: 'validation-dialog.html',
})
export class ValidationDialog {

  constructor(
    public dialogRef: MatDialogRef<ValidationDialog>,
  ) {}

  onNoClick(): void {
    this.dialogRef.close();
  }

  onSubmit(): void {
    this.dialogRef.close(true);
  }
}


@Component({
  selector: 'invoice-tool-articles',
  templateUrl: './articles.component.html',
  styleUrls: ['articles.component.scss'],
})
export class ArticlesComponent implements OnInit {

  public articles: Article[];
  public articleSubscription: Subscription;

  public articlessum: Article[];
  public articlesumSubscription: Subscription;

  public articleDataSource: MatTableDataSource<Article> = new MatTableDataSource<Article>();

  public displayedColumns: string[] = ['date', 'name', 'quantity', 'actions'];

  public isPrint: boolean;
  public isPrintSum: boolean;
  public isLoading: boolean;
  public downloadCSV: boolean;

  private isConverted = false;

  public products: Product[];

  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;


  constructor(private articleService: ArticlesService,
    private productsSubmitService: ProductsSubmitService,
    private productsService: ProductsService,
    private readonly toaster: ToasterService,
    private readonly dialog: MatDialog,
  ) {
    this.isLoading = false;
  }

  async ngOnInit(): Promise<void> {
    this.articleSubscription = this.articleService.articlesSubject.subscribe(
      (articles: Article[]) => {
        this.articles = articles;
      },
    );
    this.articleService.emitArticleSubject();

    this.articlesumSubscription = this.articleService.articlessumSubject.subscribe(
      (articlessum: Article[]) => {
        this.articlessum = articlessum;
      },
    );
    this.articleService.emitArticlesumSubject();
    this.articleDataSource.sort = this.sort;
    this.articleDataSource.paginator = this.paginator;

    this.products = await this.productsService.listAll();
  }

  setAllArticles(): Article[] {
    return [...this.articles, ...this.articlessum];
  }

  onDownloadFile(data: Article[]): void {
    const replacer = (_key, value) => value === null ? '' : value; // specify how you want to handle null values here
    const header = Object.keys(data[0]);
    const csv = data.map(row => header.map(fieldName => JSON.stringify(row[fieldName], replacer)).join(','));
    csv.unshift(header.join(','));
    const csvArray = csv.join('\r\n');

    const a = document.createElement('a');
    const blob = new Blob([csvArray], { type: 'text/csv' }),
      url = window.URL.createObjectURL(blob);

    a.href = url;
    a.download = 'myFile.csv';
    a.click();
    window.URL.revokeObjectURL(url);
    a.remove();
  }

  async onNgSubmitStockEvents(): Promise<void> {
    const dialogref = this.dialog.open(ValidationDialog);

    dialogref.afterClosed().subscribe(async (res) => {
      if (res) {
        if (this.articles.some(art => !this.productExist(art.name))) {
          this.toaster.showToaster('ERREUR: Tous les produits ne sont pas en db');
          return;
        }
        const dialogRef = this.dialog.open(OptionsDialogComponent, {
          data: {
            types: true,
          },
        });

        dialogRef.afterClosed().subscribe(async (res) => {
          if (res) {
            this.isLoading = true;
            await this.productsSubmitService.submitStockEvents(this.articles, res.type);
            this.isLoading = false;
          }
        });
      }
    });

  }

  public setArticles(): void {
    if (this.isPrint) this.isPrint = false;
    else {
      this.isPrintSum = false;
      this.displayedColumns = ['date', 'name', 'quantity', 'actions'];
      this.articleDataSource.data = this.articles;
      this.isPrint = true;
      this.articleDataSource._updateChangeSubscription();
    }
  }

  public setArticlesSum(): void {
    if (this.isPrintSum) this.isPrintSum = false;
    else {
      this.isPrint = false;
      this.displayedColumns = ['name', 'quantity'];
      this.articleDataSource.data = this.articlessum;
      this.isPrintSum = true;
      this.articleDataSource._updateChangeSubscription();
    }
  }

  public onEditArticle(article: Article): void {
    const diaogRef = this.dialog.open(EditArticleDialogComponent, {
      data: article,
    });

    diaogRef.afterClosed().subscribe(
      async (res) => {
        if (res) {
          if (res.product) {
            this.products = await this.productsService.listAll();
          }
          if (res.article) {
            this.articleService.editArticles(article, res.article);
            this.articleDataSource.data = this.articles;
            this.articleDataSource._updateChangeSubscription();
          }
          if (res.removed) {
            const dialog = this.dialog.open(ValidationDialog);
            dialog.afterClosed().subscribe(async res => {
              if (res) {
                const index = this.articleDataSource.data.indexOf(article);
                if (index > -1) {
                  this.articleDataSource.data.splice(index, 1);
                  this.articleDataSource._updateChangeSubscription();
                  this.articleService.removeArticle(article);
                }
              }
            });
          }
        }
      },
    );
  }

  public productExist(productName: string): boolean {
    return this.products.some(p => p.name === productName);
  }

  public onConvertKaisse(): void {
    this.articles.map(art => this.convertKaisseToArticle(art, this.isConverted));
    this.articlessum.map(art => this.convertKaisseToArticle(art, this.isConverted));
    this.isConverted = !this.isConverted;
    this.articleDataSource._updateChangeSubscription();
  }

  public convertThisArticle(article: Article): void {
    const index = this.articleDataSource.data.indexOf(article);
    if (index > -1) {
      this.articleDataSource.data[index] = this.convertKaisseToArticle(article, this.isConverted);
      this.articleDataSource._updateChangeSubscription();
    }
  }

  private convertKaisseToArticle(article: Article, isConverted: boolean): Article {
    const product = this.products.find(product => product.name === article.name);
    if (product && product.conversions && product.conversions.length > 0) {
      const conv = product.conversions.find(conv => conv.displayName === 'Kaisse');
      if (conv) {
        if (isConverted) {
          article.quantity = article.quantity / conv.coef;
        } else {
          article.quantity = article.quantity * conv.coef;
        }
      }
    }
    return article;
  }
}
