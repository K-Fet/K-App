import { Component, OnInit, ViewChild } from '@angular/core';
import { ArticlesService } from '../services/articles.service';
import { Article } from '../article';
import { Subscription } from 'rxjs';
import { ProductsSubmitService } from '../services/products-submit.service';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { MatDialog } from '@angular/material/dialog';
import { OptionsDialogComponent } from '../options-dialog/options-dialog.component';

@Component({
  selector: 'invoice-tool-articles',
  templateUrl: './articles.component.html',
  styleUrls: ['articles.component.scss']
})
export class ArticlesComponent implements OnInit{

  public articles: Article[];
  public articleSubscription: Subscription;
   
  public articlessum: Article[];
  public articlesumSubscription: Subscription;

  public articleDataSource: MatTableDataSource<Article> = new MatTableDataSource<Article>();

  public displayedColumns: string[] = ['date', 'name', 'quantity'];

  public isPrint: boolean;
  public isPrintSum: boolean;
  public isLoading: boolean;
  public downloadCSV: boolean;

  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;
  @ViewChild(MatSort, {static: true}) sort: MatSort;


  constructor(  private articleService: ArticlesService,
                private productsSubmitService: ProductsSubmitService,
                private readonly dialog: MatDialog,
             )
              {
                this.isLoading = false;
              }

  ngOnInit(): void {
    this.articleSubscription = this.articleService.articlesSubject.subscribe(
      (articles: Article[]) => {
        this.articles = articles;
      }
    );
    this.articleService.emitArticleSubject();

    this.articlesumSubscription = this.articleService.articlessumSubject.subscribe(
      (articlessum: Article[]) => {
        this.articlessum = articlessum;
      }
    );
    this.articleService.emitArticlesumSubject();
    this.articleDataSource.sort = this.sort;
    this.articleDataSource.paginator = this.paginator;
  }

  setAllArticles(): Article[]{
    const articles = [];
    for(let i = 0; i<this.articles.length; i++) articles.push(this.articles[i]);
    for(let i = 0; i<this.articlessum.length; i++) articles.push(this.articlessum[i]);
    return articles;
  }

  onCopyData(): void{
    let tocopy = '';
    for(let i =0 ; i<this.articlessum.length ; i++){
      tocopy += this.articlessum[i].name + ';' + this.articlessum[i].quantity + '\n';
    }

    const selBox = document.createElement('textarea');
    selBox.style.position = 'fixed';
    selBox.style.left = '0';
    selBox.style.top = '0';
    selBox.style.opacity = '0';
    selBox.value = tocopy;
    document.body.appendChild(selBox);
    selBox.focus();
    selBox.select();
    document.execCommand('copy');
    document.body.removeChild(selBox);
  }

  onDownloadFile(data: Article[]): void {
    const replacer = (_key: any, value: any) => value === null ? '' : value; // specify how you want to handle null values here
    const header = Object.keys(data[0]);
    const csv = data.map(row => header.map(fieldName => JSON.stringify(row[fieldName], replacer)).join(','));
    csv.unshift(header.join(','));
    const csvArray = csv.join('\r\n');

    const a = document.createElement('a');
    const blob = new Blob([csvArray], {type: 'text/csv' }),
    url = window.URL.createObjectURL(blob);

    a.href = url;
    a.download = "myFile.csv";
    a.click();
    window.URL.revokeObjectURL(url);
    a.remove();
  }

  async onNgSubmitProducts(): Promise<void> {
    const dialogRef = this.dialog.open(OptionsDialogComponent, {
      data: {
        providers: true,
      }
    });
    dialogRef.afterClosed().subscribe(async (res) => {
      if(res){
        this.isLoading = true;
        await this.productsSubmitService.submitProducts(this.articlessum, res.provider);
        this.isLoading = false;
        return Promise.resolve();
      }
    });
  }

  async onNgSubmitStockEvents(): Promise<void> {
    const dialogRef = this.dialog.open(OptionsDialogComponent, {
      data: {
        types: true,
      }
    });

    dialogRef.afterClosed().subscribe(async (res) => {
      this.isLoading = true;
      await this.productsSubmitService.submitStockEvents(this.articles, res.type);
      this.isLoading = false;
      return Promise.resolve();
    });
  }

  public setArticles(): void {
    if(this.isPrint) this.isPrint = false; 
    else {
      this.isPrintSum = false;
      this.displayedColumns = ['date', 'name', 'quantity'];
      this.articleDataSource.data = this.articles;
      this.isPrint = true;
      this.articleDataSource._updateChangeSubscription();
    }
  }

  public setArticlesSum(): void {
    if(this.isPrintSum) this.isPrintSum = false; 
    else {
      this.isPrint = false;
      this.displayedColumns = ['name', 'quantity'];
      this.articleDataSource.data = this.articlessum;
      this.isPrintSum = true;
      this.articleDataSource._updateChangeSubscription();
    }
  }

}