import { Barman } from './index';

export class Service {

  id?: number;
  startAt: Date;
  endAt: Date;
  nbMax: number;

  // Association

  barmen?: Barman[];

  constructor(values: Object = {}) {
    Object.assign(this, values);

    const castVal = values as Service;

    this.startAt = castVal.startAt ? new Date(castVal.startAt) : null;
    this.endAt = castVal.endAt ? new Date(castVal.endAt) : null;
  }

  isPasted(): Boolean {
    return this.endAt.getTime() < Date.now();
  }
}
