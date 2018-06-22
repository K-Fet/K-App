import { Barman } from './Barman';

export class Kommission {

  id: Number;
  name: String;
  description: String;
  barmen: Barman[];

  constructor(values: Object = {}) {
    Object.assign(this, values);
  }
}
