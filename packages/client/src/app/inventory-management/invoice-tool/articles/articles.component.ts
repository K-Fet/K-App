import { Component, OnInit } from '@angular/core';
import { ArticlesService } from '../services/articles.service';
import { Article } from '../article';
import { Subscription } from 'rxjs';
import { ProductsSubmit } from '../services/products-submit.service';

@Component({
  selector: 'invoice-tool-articles',
  templateUrl: './articles.component.html',
  styleUrls: ['articles.component.scss']
})
export class ArticlesComponent implements OnInit{

  articles: Article[];
  articleSubscription: Subscription;

  articlessum: Article[];
  articlesumSubscription: Subscription;

  displayedColumns: string[] = ['date', 'name', 'quantity'];
  displayedColumns2: string[] = ['name', 'quantity'];

  isPrint: boolean;
  isPrintSum: boolean;
  isLoading: boolean;
  downloadCSV: boolean;


  constructor(  private articleService: ArticlesService,
                private productsSubmit: ProductsSubmit,)
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

    this.isLoading = true;
    await this.productsSubmit.submitProducts(this.articlessum);
    this.isLoading = false;
    return Promise.resolve();
  }

}
