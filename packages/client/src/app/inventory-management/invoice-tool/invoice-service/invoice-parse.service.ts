import { Injectable } from '@angular/core';
import * as PDFJS from 'pdfjs-dist/build/pdf';
import PDFJSWorker from 'pdfjs-dist/build/pdf.worker.entry';

@Injectable()

export class InvoiceParseService {

  textinvoices = [];
  listarticle = [];
  nbplastinvoice = 0;



  async fromFiletoText(invoice: File): Promise<void> {

    const url = URL.createObjectURL(invoice);
    const oneinvoice = await this.gettext(url);
    this.nbplastinvoice = oneinvoice.length;
    for(let i=0;i<oneinvoice.length;i++){
      this.textinvoices.push(oneinvoice[i]);
    }
    URL.revokeObjectURL(url);
    return Promise.resolve();
  }

  parsePDF(): void {

    const listinvoices = this.textinvoices;
    const listothers = [];
    let toremove = [];

    //Separate invoices and credits
    for(let i = 0; i<listinvoices.length; i++){
      if(listinvoices[i].indexOf('FACTURECOMMUNAUTE')<0){
        toremove.push(i);
      }
    }
    for(let i = toremove.length-1;i>=0;i--){
      listothers.push(listinvoices.splice(toremove[i],1));
    }

    //Remove empty invoices
    toremove = [];
    for(let i = 0; i<listinvoices.length; i++){
      if(listinvoices[i].indexOf('Commande')==0 || listinvoices[i].indexOf('_')==0){
        toremove.push(i);
      }
    }
    for(let i = toremove.length-1;i>=0;i--){
      listothers.push(listinvoices.splice(toremove[i],1));
    }

    //Parsing
    for(let i = 0; i<listinvoices.length; i++){
      let index = listinvoices[i].indexOf('CLIENT FACTURE');
      listinvoices[i] = listinvoices[i].substring(0,index-1);
      if(listinvoices[i].indexOf('Frais administratifs')>0){
        index = listinvoices[i].indexOf('Frais administratifs');
        listinvoices[i] = listinvoices[i].substring(0,index);
      }
      if(listinvoices[i].indexOf('_')>0){
        index = listinvoices[i].indexOf('_');
        listinvoices[i] = listinvoices[i].substring(0,index);
      }
    }


    for(let i = 0; i<listinvoices.length; i++){
      listinvoices[i] = listinvoices[i].replace('19,5L','20L');   //Grolsch
      const listinvoicesparse = listinvoices[i].split(' ');
      toremove = [];
      for(let i = 0; i<listinvoicesparse.length; i++){
        if(listinvoicesparse[i]=='' || listinvoicesparse[i].indexOf(',')>=0 || listinvoicesparse[i].indexOf('°')>=0){
          toremove.push(i);
        }
      }
      for(let i = toremove.length-1;i>=0;i--){
        listinvoicesparse.splice(toremove[i],1);
      }
      listinvoicesparse.splice(0,1);
      listinvoices[i]=listinvoicesparse.join(' ');
    }

    const listarticles = [];
    for(let i=0;i<listinvoices.length; i++){
      const listinvoicesparse = listinvoices[i].split(' net');
      for(let i=0;i<listinvoicesparse.length;i++){
        listarticles.push(listinvoicesparse[i]);
      }
    }


    const listarticlesparse = [];
    //Cols and Colis
    for(let i=0;i<listarticles.length;i++){
      const articlenombre = [];
      let nomarticle = '';
      const articlesparse = listarticles[i].split(' ');
      let last = articlesparse[articlesparse.length-1].split('');
      if(last.length<5){
        last.splice(1,last.length);
      }
      else{
        last.splice(2,last.length)
      }
      last = last.join('');
      articlesparse.pop();
      if(articlesparse[0]=='') articlesparse.shift();
      nomarticle=articlesparse.join(' ');

      articlenombre.push(nomarticle,+last);
      listarticlesparse.push(articlenombre);
      listarticles[i]=nomarticle+' '+last;
    }

    const nomarticle = [];
    const finallist = [];

    for(const i in listarticlesparse){
      const index = nomarticle.indexOf(listarticlesparse[i][0]);
      if(index<0){
        nomarticle.push(listarticlesparse[i][0]);
        finallist.push(listarticlesparse[i]);
      }
      else{
        finallist[index][1] += listarticlesparse[i][1];
      }
    }

    toremove = [];
    for(const i in finallist){
      if(finallist[i][0]=='') toremove.push(i);
    }
    for(let i = toremove.length-1;i>=0;i--){
      (finallist.splice(toremove[i],1));
    }

    this.listarticle = finallist;

  }


  async gettext(pdfUrl: string): Promise<string[]> {
    PDFJS.GlobalWorkerOptions.workerSrc = PDFJSWorker;
    const pdf = PDFJS.getDocument(pdfUrl).promise;
    return pdf.then(function(pdf: { numPages: number; getPage: (arg0: number) => any}) { // get all pages text
      const maxPages = pdf.numPages;
      const countPromises = []; // collecting all page promises
      for (let j = 1; j <= maxPages; j++) {
        const page = pdf.getPage(j);
        
        //var txt = "";
        countPromises.push(page.then(function(page: { getTextContent: () => any}) { // add page promise
          const textContent = page.getTextContent();
          return textContent.then(function(text: { items: any[]}){ // return content promise
            return text.items.map(function (s: { str: any}) { return s.str; }).join(''); // value page text
          });
        }));
      }
      // Wait for all pages and join text
      return Promise.all(countPromises).then(function (texts) {
        return texts;
      });
    });
  }
}
