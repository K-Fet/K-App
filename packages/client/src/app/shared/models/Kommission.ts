import { User } from './User';
import { ExcludeMethods } from '../../../utils';

export class Kommission {

  _id?: string;
  createdAt?: Date;
  updatedAt?: Date;
  name: string;
  description?: string;

  barmen: string[] | User[];

  constructor(values: ExcludeMethods<Kommission>) {
    Object.assign(this, values);
  }
}
