import { Component, OnInit } from '@angular/core';
import { InvoiceService } from '../invoice-service/invoice.service';
import { InvoiceParseService } from '../invoice-service/invoice-parse.service';
import { Subscription } from 'rxjs';


@Component({
  templateUrl: './invoice-parse.component.html',
  styles: [`
    #dropzone {
      background-color: white;
      height: 300px;
      border: 5px dotted #ccc;
    }

    #dropzone:hover {
      border-color: black;
    }
  `]
})

export class InvoiceParse implements OnInit {

  invoices: File[];
  articles: any[];
  isLoading: boolean;
  isPrint: boolean;


  invoiceSubscription: Subscription;
  constructor(private invoiceService: InvoiceService,
              private invoiceParseService: InvoiceParseService) { }

  ngOnInit(): void {
    this.invoiceSubscription = this.invoiceService.invoicesSubject.subscribe(
      (invoices: File[]) => {
        this.invoices = invoices;
      }
    );
    this.invoiceService.emitAppareilSubject();
    this.isLoading = false;
    this.articles = [];
    this.isPrint = false;
  }

  onDrop(e: any): void {
    e.preventDefault(); 
    const files: File = e.dataTransfer.files;
    Object.keys(files).forEach((key) => {
      const file: File = files[key];
      if(file.type === "application/pdf"){
        this.invoiceService.addInvoice(file);
      }
    });
  }

  onRemove(): void {
    this.invoiceService.removeInvoice();
  }

  async onSubmit(): Promise<void>{

    this.isLoading = true;
    for(let i=0; i<this.invoices.length; i++){
      await this.invoiceParseService.fromFiletoText(this.invoices[i]);
    }
    this.invoiceParseService.parsePDF();
    this.articles = this.invoiceParseService.listarticle;
    this.invoiceService.removeAll();
    
    this.isLoading = false;
    return Promise.resolve();
  }

  onPrint(): void{
    this.isPrint = !this.isPrint;
  }
  



  onCopyData(): void{
    let tocopy = '';
    for(let i =0 ; i<this.articles.length ; i++){
      tocopy += this.articles[i][0] + ';' + this.articles[i][1] + '\n';
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

}
