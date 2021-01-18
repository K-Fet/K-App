import { Injectable } from '@angular/core';
import { setHours } from 'date-fns';
import * as PDFJS from 'pdfjs-dist/build/pdf';
import PDFJSWorker from 'pdfjs-dist/build/pdf.worker.entry';

@Injectable()

export class ParseService {

  textinvoices = [];
  listarticle = [];
  articleSum = [];

  csvtext = "";
  fileReader = new FileReader();


  async fromFilestoText(invoices: File[]): Promise<void> {
    this.listarticle = [];
    this.articleSum = [];

    if(invoices[0].type === 'application/pdf'){
     await Promise.all(invoices.map(async (invoice) => {
        const url = URL.createObjectURL(invoice);
        const oneinvoice = await this.gettext(url);
        oneinvoice.map(text => this.textinvoices.push(text));
        URL.revokeObjectURL(url);
      }));
      this.parsePDF();
    }
    else {
      this.csvtext = '';
      if(invoices[0]){
        const text = await this.readfile(0, invoices);
        this.parseCsv(text);
      }
    }
  }

  private async readfile(index: number, files: File[]): Promise<string> {
    return new Promise((resolve) => {
      if( index >= files.length ) {
        return;
      }
      const file = files[index];
      this.fileReader.onload = async(e): Promise<void> => {  
        // get file content  
        const target = e.target as FileReader;
        this.csvtext += target.result.toString();
        await this.readfile(index+1, files);
      }
      this.fileReader.readAsText(file);
      setTimeout(() => resolve(this.csvtext), 100*files.length);
    });
  }

  private parseCsv(csv: string): void {
    let errorInCsv = false;
    const articlesStr = csv.split('\n');
    articlesStr.pop();
    articlesStr.map( art => {
      const artPrsStr = art.split(',');
      if(artPrsStr.length != 3 ){
        errorInCsv = true;
      }
      else if(!errorInCsv){
        const date = setHours(new Date(artPrsStr[0]),10);
        this.listarticle.push([date, artPrsStr[1], +artPrsStr[2]]);
      }
    });
    if(errorInCsv){
      this.listarticle = [];
      this.articleSum = [];
    }
    this.sumFromDate();
  }

  private parsePDF(): void {

    let listinvoices  = [];

    this.textinvoices.map(textinvoice => {
      const invoiceDate = this.getDate(textinvoice);
      if(invoiceDate !== undefined){
        const invoice = [];
        invoice.push(invoiceDate);
        invoice.push(textinvoice);
        listinvoices.push(invoice);
      }
    });

    //Separate invoices and credits and remove empty invoices 
    listinvoices = listinvoices.filter( invoice => (invoice[1].indexOf('FACTURECOMMUNAUTE')>-1 && invoice[1].indexOf('Commande')!==0 && invoice[1].indexOf('_')!==0));
    
    //Parsing
    listinvoices.map((invoice) => {
      let index = invoice[1].indexOf('CLIENT FACTURE');
      invoice[1] = invoice[1].substring(0,index-1);
      if(invoice[1].indexOf('Frais administratifs')>0){
        index = invoice[1].indexOf('Frais administratifs');
        invoice[1] = invoice[1].substring(0,index);
      }
      if(invoice[1].indexOf('_')>0){
        index = invoice[1].indexOf('_');
        invoice[1] = invoice[1].substring(0,index);
      }
    })

    listinvoices.forEach((invoice) => {
      let listinvoicesparse = invoice[1].split(' ');
      listinvoicesparse = listinvoicesparse.filter((invoiceparse: string) => invoiceparse!=='' && invoiceparse.indexOf('°')===-1);
      listinvoicesparse.splice(0,1);
      invoice[1]=listinvoicesparse.join(' ');
    })

    const listarticles = [];
    const listdates = [];

    listinvoices.map((invoice) => {
      const date = invoice[0];
      const listinvoicesparse = invoice[1].split(' net');
      listinvoicesparse.map((invoiceparse) => {
        listdates.push(date);
        listarticles.push(invoiceparse);
      });
    });
    
    //Parse , and manage GROLSCH exception
    Object.keys(listarticles).forEach((key) => {
      let onearticleparse = listarticles[key].split(' ');
      if(onearticleparse.indexOf("GROLSCH")<0){
        onearticleparse = onearticleparse.filter((art: string) => (art!=='' && art.indexOf(',')===-1));
      }
      else{
        if(onearticleparse[0] == "GROLSCH") onearticleparse.splice(onearticleparse.length-1,1);
        else{
          onearticleparse.splice(0,5);
          onearticleparse.splice(onearticleparse.length-1,1);
        }
        if(onearticleparse[onearticleparse.length-1].indexOf(",")>0){
          onearticleparse[onearticleparse.length-1] = onearticleparse[onearticleparse.length-1].substring(0,onearticleparse[onearticleparse.length-1].length-2) ;
        }
      }
      listarticles[key]=onearticleparse.join(' ');
    });

    const listarticlesparse = [];
    //Cols and Colis
    Object.keys(listarticles).forEach(key => {
      const articlenombre = [];
      let nomarticle = '';
      const articlesparse = listarticles[key].split(' ');
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
      listarticles[key]=nomarticle+' '+last;
    });
    
    //Copy Array listearticleparse to have 2 distincts Array
    const listarticlesparsesum = [];
    listarticlesparse.map(art => {
      const article = [];
      article.push(art[0],art[1]);
      listarticlesparsesum.push(article);
    })

    //Create sum List
    let finallistsum = [];
    const nomarticle = [];
    listarticlesparsesum.map((art) => {
      const index = nomarticle.indexOf(art[0]);
      if(index<0){
        nomarticle.push(art[0]);
        finallistsum.push(art);
      }
      else{
        finallistsum[index][1] += art[1];
      }
    });
    finallistsum = finallistsum.filter(art => art[0]!=='');

    this.articleSum = finallistsum;

    
    //Create list with date
    let finallist = [];
    Object.keys(listarticlesparsesum).forEach((key) => {
      listarticlesparse[key].unshift(listdates[key]);
      finallist.push(listarticlesparse[key]);
    })

    finallist = finallist.filter( art => art[1]!=='' && !isNaN(art[2]))
    
    //Filter and modify article to have only one ny product for each date
    finallist = finallist.filter((art, index) => {
      const artindex = finallist.findIndex(artb => {
        return (artb[1] === art[1]) && (artb[0].getDate()===art[0].getDate() && artb[0].getMonth()===art[0].getMonth() && artb[0].getMonth()===art[0].getMonth());
      });
      if(artindex !== index) finallist[artindex][2] += finallist[index][2];
      return artindex === index;
    });  
    this.listarticle = finallist;
  }

  getDate(invoice: string): Date{
    const invoiceparse = invoice.split(' ');
    const invoicePart: string = invoiceparse.find((obj: string) => obj.indexOf('fact') === 0  && obj.indexOf('date') > 0);
    if(invoicePart){
      let datestring = invoicePart.slice(4,14);
      const dateparse = datestring.split('.');
      datestring = dateparse[2] + '-' + dateparse[1] + '-' + dateparse[0] + 'T12:00:00';
      const invoiceDate = setHours(new Date(datestring),10);
      return invoiceDate;       // Return Date Invoice
    }
    else return null;
  }


  async gettext(pdfUrl: string): Promise<string[]> {
    PDFJS.GlobalWorkerOptions.workerSrc = PDFJSWorker;
    const pdf = PDFJS.getDocument(pdfUrl).promise;
    return pdf.then(function(pdf: { numPages: number; getPage: (arg0: number) => any}) { // get all pages text
      const maxPages = pdf.numPages;
      const countPromises = []; // collecting all page promises
      for(let j = 1; j <= maxPages; j++) {
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
  
  private sumFromDate(): void{
    const soonAssigned: string[] = [];
    const art =  this.listarticle.reduce((previousValue,currentArt) => {
      const index = soonAssigned.findIndex((value) => currentArt[1] === value);
      if(index===-1){
        soonAssigned.push(currentArt[1]);
        return [...previousValue, [currentArt[1], currentArt[2]]];
      }
      else{
        previousValue[index][1] += currentArt[2];
        return previousValue;
      }
    }, []);
    this.articleSum = [...art];
  }

  removeAll(): void{
    this.listarticle = [];
    this.articleSum = [];
    this.textinvoices = [];
  }
}