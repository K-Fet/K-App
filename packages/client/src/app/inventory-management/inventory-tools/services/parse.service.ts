import { Injectable } from '@angular/core';
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

    if(invoices[0].type === 'application/pdf'){
      for(let i=0; i<invoices.length; i++){
        const url = URL.createObjectURL(invoices[i]);
        const oneinvoice = await this.gettext(url);
        for(let i=0;i<oneinvoice.length;i++){
          this.textinvoices.push(oneinvoice[i]);
        }
        URL.revokeObjectURL(url);
      }
      this.parsePDF();
    }
    else {
      this.csvtext = '';
      if(invoices[0]){
        const text = await this.readfile(0, invoices);
        this.parseCsv(text);
      }
    }
    return Promise.resolve();
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
    this.listarticle = [];
    this.articleSum = [];
    const articlesStr = csv.split('\n');
    articlesStr.pop();
    for(const art of articlesStr){
      const artPrsStr = art.split(',');
      if(artPrsStr.length != 3 ){
        this.listarticle = [];
        this.articleSum = [];
        break;
      }
      this.listarticle.push([new Date(artPrsStr[0]), artPrsStr[1], +artPrsStr[2]]);
    }
    this.sumFromDate();
  }

  parsePDF(): void {

    const listinvoices  = [];

    for(let i=0; i<this.textinvoices.length; i++){
      const invoiceDate = this.getDate(this.textinvoices[i]);
      if(invoiceDate != undefined){
        const invoice = [];
        invoice.push(invoiceDate);
        invoice.push(this.textinvoices[i]);
        listinvoices.push(invoice);
      }
    }

    const listothers = [];
    
    let toremove = [];
    //Separate invoices and credits
    for(let i = 0; i<listinvoices.length; i++){
      if(listinvoices[i][1].indexOf('FACTURECOMMUNAUTE')<0){
        toremove.push(i);
      }
    }
    for(let i = toremove.length-1;i>=0;i--){
      listothers.push(listinvoices.splice(toremove[i],1));
    }
    
    // //Remove empty invoices
    toremove = [];
    for(let i = 0; i<listinvoices.length; i++){
      if(listinvoices[i][1].indexOf('Commande')==0 || listinvoices[i][1].indexOf('_')==0){
        toremove.push(i);
      }
    }
    for(let i = toremove.length-1;i>=0;i--){
      listothers.push(listinvoices.splice(toremove[i],1));
    }
    

    //Parsing
    for(let i = 0; i<listinvoices.length; i++){
      let index = listinvoices[i][1].indexOf('CLIENT FACTURE');
      listinvoices[i][1] = listinvoices[i][1].substring(0,index-1);
      if(listinvoices[i][1].indexOf('Frais administratifs')>0){
        index = listinvoices[i][1].indexOf('Frais administratifs');
        listinvoices[i][1] = listinvoices[i][1].substring(0,index);
      }
      if(listinvoices[i][1].indexOf('_')>0){
        index = listinvoices[i][1].indexOf('_');
        listinvoices[i][1] = listinvoices[i][1].substring(0,index);
      }
    }

    for(let i = 0; i<listinvoices.length; i++){
      const listinvoicesparse = listinvoices[i][1].split(' ');
      toremove = [];
      for(let i = 0; i<listinvoicesparse.length; i++){
        if(listinvoicesparse[i]=='' || listinvoicesparse[i].indexOf('°')>=0){
          toremove.push(i);
        }
      }
      for(let i = toremove.length-1;i>=0;i--){
        listinvoicesparse.splice(toremove[i],1);
      }
      listinvoicesparse.splice(0,1);
      listinvoices[i][1]=listinvoicesparse.join(' ');
    }

    const listarticles = [];
    const listdates = [];
    for(let i=0;i<listinvoices.length; i++){
      const date = listinvoices[i][0];
      const listinvoicesparse = listinvoices[i][1].split(' net');
      for(let i=0;i<listinvoicesparse.length;i++){
        listdates.push(date);
        listarticles.push(listinvoicesparse[i]);
      }
    }
    
    //Parse , and manage GROLSCH exception
    for(let i=0; i<listarticles.length; i++){
      const onearticleparse = listarticles[i].split(' ');
      if(onearticleparse.indexOf("GROLSCH")<0){
        toremove = [];
        for(let i = 0; i<onearticleparse.length; i++){
          if(onearticleparse[i]=='' || onearticleparse[i].indexOf(',')>=0){
            toremove.push(i);
          }
        }
        for(let i = toremove.length-1;i>=0;i--){
          onearticleparse.splice(toremove[i],1);
        }
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
      listarticles[i]=onearticleparse.join(' ');
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
    
    //Copy Array listearticleparse to have 2 distincts Array
    const listarticlesparsesum = [];
    for(let i=0 ; i<listarticlesparse.length;i++){
      const article = [];
      article.push(listarticlesparse[i][0],listarticlesparse[i][1]);
      listarticlesparsesum.push(article);
    }

    //Create sum List
    const finallistsum = [];
    const nomarticle = [];
    for(const i in listarticlesparsesum){
      const index = nomarticle.indexOf(listarticlesparsesum[i][0]);
      if(index<0){
        nomarticle.push(listarticlesparsesum[i][0]);
        finallistsum.push(listarticlesparsesum[i]);
      }
      else{
        finallistsum[index][1] += listarticlesparsesum[i][1];
      }
    }
    toremove = [];
    for(const i in finallistsum){
      if(finallistsum[i][0]=='') toremove.push(i);
    }
    for(let i = toremove.length-1;i>=0;i--){
      (finallistsum.splice(toremove[i],1));
    }


    this.articleSum = finallistsum;

    
    //Create list with date
    const finallist = [];
    for(const i in listarticlesparse){
      listarticlesparse[i].unshift(listdates[i]);
      finallist.push(listarticlesparse[i]);
    }

    toremove = [];
    for(const i in finallist){
      if(finallist[i][1]==='' || isNaN(finallist[i][2])) toremove.push(i);
    }

    for(let i = toremove.length-1;i>=0;i--){
      (finallist.splice(toremove[i],1));
    }


    toremove = [];
    for(let i=0; i<finallist.length; i++){
      for(let j=i+1; j<finallist.length; j++){
        if(finallist[i][1]===finallist[j][1]){
          if(finallist[i][0].getDate()===finallist[j][0].getDate() && finallist[i][0].getMonth()===finallist[j][0].getMonth() && finallist[i][0].getFullYear()===finallist[j][0].getFullYear()){
            finallist[i][2] += finallist[j][2];
            toremove.push(j);
          }
        }
      }
    }
    for(let i = toremove.length-1;i>=0;i--){
      (finallist.splice(toremove[i],1));
    }
  
    this.listarticle = finallist;
  }

  getDate(invoice: string): Date{

    const invoiceparse = invoice.split(' ');
    for(let i=0; i<invoiceparse.length; i++){
      if(invoiceparse[i].indexOf('fact') === 0  && invoiceparse[i].indexOf('date') > 0){
        let datestring = invoiceparse[i].slice(4,14);
        const dateparse = datestring.split('.');
        datestring = dateparse[2] + '-' + dateparse[1] + '-' + dateparse[0] + 'T12:00:00';
        const invoiceDate = new Date(datestring);
        return invoiceDate;       // Return Date Invoice
      }
    }
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
  
  private sumFromDate(): void{
    const soonAssigned: string[] = [];
    for(const art of this.listarticle){
      const index = soonAssigned.indexOf(art[1]);
      if(index === -1){
        this.articleSum.push([art[1], art[2]]);
        soonAssigned.push(art[1]);
      }
      else {
        this.articleSum[index][1] += art[2];
      }
    }
  }

  removeAll(): void{
    this.listarticle = [];
    this.articleSum = [];
    this.textinvoices = [];
  }
}
