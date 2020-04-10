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

    constructor(private parseService: ParseService) {
      this.articles = [];
      this.articlessum = [];
    }

    emitArticleSubject(): void {
        this.articlesSubject.next(this.articles.slice());
    }

    putArticles(): void {
      this.articles = [];
      const someArticles = this.parseService.listarticle;
      for(let i=0; i<someArticles.length; i++){
        const oneArticle = new Article();
        oneArticle.date = someArticles[i][0];
        oneArticle.name = someArticles[i][1];
        oneArticle.quantity = someArticles[i][2];
        this.articles.push(oneArticle);
      }
      this.emitArticleSubject();
      }

    emitArticlesumSubject(): void {
        this.articlessumSubject.next(this.articlessum.slice());
    }

    putArticlessum(): void {
      this.articlessum = [];
      const someArticles = this.parseService.articleSum;
      for(let i=0; i<someArticles.length; i++){
        const oneArticle = new Article();
        oneArticle.name = someArticles[i][0];
        oneArticle.quantity = someArticles[i][1];
        this.articlessum.push(oneArticle);
      }
      this.emitArticlesumSubject();
    }

}