import { Subject } from 'rxjs';
import { Injectable } from '@angular/core';
import { ParseService } from './parse.service';
import { Article } from '../article';

@Injectable()

export class ArticlesService {

    articlesSubject = new Subject<Article[]>();
    articles: Article[];

    articlessumSubject = new Subject<Article[]>();
    articlessum: Article[];

    constructor(private parseService: ParseService)
    {
      this.articles = [];
      this.articlessum = [];
    }

    emitArticleSubject(): void {
        this.articlesSubject.next(this.articles.slice());
    }

    putArticles(): void {
      this.articles = [];
      this.parseService.listarticle.forEach( art => {
        const oneArticle = new Article();
        oneArticle.date = art[0];
        oneArticle.name = art[1];
        oneArticle.quantity = art[2];
        this.articles.push(oneArticle);
      });
      this.emitArticleSubject();
      }

    emitArticlesumSubject(): void {
        this.articlessumSubject.next(this.articlessum.slice());
    }

    removeArticle(article: Article): void{
      const index = this.articles.indexOf(article);
      if(index > -1){
        this.articles.splice(index, 1);
      }
      this.emitArticleSubject();
    }

    putArticlessum(): void {
      this.articlessum = [];
      this.parseService.articleSum.forEach( art => {
        const oneArticle = new Article();
        oneArticle.name = art[0];
        oneArticle.quantity = art[1];
        this.articlessum.push(oneArticle);
      });
      this.emitArticlesumSubject();
    }

    editArticles(oldarticle: Article, newarticle: Article): void{
      const oldname = oldarticle.name;
      this.articles.forEach( art => {
        if(art.name === oldname){
          if(art === oldarticle){
            art.name = newarticle.name;
            art.date = newarticle.date;
            art.quantity = newarticle.quantity;
          } else {
            art.name = newarticle.name;
          }
        }
      });
      this.emitArticleSubject();
    }
}