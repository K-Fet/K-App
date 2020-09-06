import { Component, OnInit } from '@angular/core';
import { InvoicesService } from '../services/invoices.service';
import { ArticlesService } from '../services/articles.service';
import { ParseService } from '../services/parse.service';


@Component({
  templateUrl: './home-page.component.html',
  styleUrls: ['./home-page.component.scss']
})

export class HomePageComponent implements OnInit {

  isLoading: boolean;
  invoicesEmpty: boolean;
  articlesEmpty: boolean;

  constructor(private invoiceService: InvoicesService,
              private parseService: ParseService,
              private articleService: ArticlesService) { }

  ngOnInit(): void {
    this.isLoading = false;
    this.invoicesEmpty = true;
    this.articlesEmpty = true;
  }

  onDrop(e: any): void {
    e.preventDefault(); 
    const files: File = e.dataTransfer.files;
    Object.keys(files).forEach((key) => {
      const file: File = files[key];
      if(file.type === "application/pdf"){
        this.invoiceService.addInvoice(file);
        this.invoicesEmpty = false;
      }
    });
  }

  onRemove(): void {
    this.invoiceService.removeInvoice();
    if(this.invoiceService.invoices.length==0){
      this.invoicesEmpty = true;
    }
  }

  async onSubmit(): Promise<void>{

    this.isLoading = true;
    await this.invoiceService.submitInvoices();
    this.articleService.putArticles();
    this.articleService.putArticlessum();
    this.invoiceService.removeAll();
    this.parseService.removeAll();
    this.isLoading = false;
    this.invoicesEmpty = true;
    this.articlesEmpty = false;
    return Promise.resolve();
  }
}
