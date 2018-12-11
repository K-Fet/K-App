import { Service } from '.';

export class Day {
  name: string;
  date: Date;
  active: boolean;
  services: Service[];

  constructor(values: Object = {}) {
    Object.assign(this, values);
  }
}
