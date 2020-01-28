import { Barman } from '.';
import { ExcludeMethods } from '../../../utils';

export class Service {

  _id?: string;
  createdAt?: Date;
  updatedAt?: Date;
  startAt: Date;
  endAt: Date;
  nbMax?: number;

  barmen?: string[] | Barman[];

  constructor(values: ExcludeMethods<Service>) {
    Object.assign(this, values);
    this.startAt = values.startAt ? new Date(values.startAt) : null;
    this.endAt = values.endAt ? new Date(values.endAt) : null;
  }

  isPassed(): boolean {
    return this.endAt.getTime() < Date.now();
  }
}
