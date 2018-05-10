import { Barman, Kommission, AssociationChanges } from './index';

export class Task {
  id: Number;
  name: string;
  deadLine: Date;
  state: string;
  description: string;
  createdAt: Date;
  updatedAt: Date;
  kommission: Kommission;
  barmen: Array<Barman>;

  _embedded: {
    barmen?: AssociationChanges;
  }

  constructor(values: Object = {}) {
     Object.assign(this, values);
  }

}
