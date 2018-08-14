import { Service } from './index';
import { Moment } from 'moment';

export class Day {
  name: string;
  date: Moment;
  active: boolean;
  services: Service[];

  constructor(values: Object = {}) {
    Object.assign(this, values);
  }
}
