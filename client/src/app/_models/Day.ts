import { Service } from '.';
import { Moment } from 'moment';

export class Day {
  name: String;
  date: Moment;
  active: Boolean;
  services: Service[];

  constructor(values: Object = {}) {
    Object.assign(this, values);
  }
}
