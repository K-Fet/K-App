export class Article {
  public date: Date;
  public name: string;
  public quantity: number;

  print(): void{
    console.log(this.date + " " + this.name + " " + this.quantity);
  }
}
