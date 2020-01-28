import { ExcludeMethods } from '../../../utils';

export class Role {

  _id?: string;
  createdAt?: Date;
  updatedAt?: Date;
  name: string;
  description?: string;
  permissions?: string[];

  constructor(values: ExcludeMethods<Role>) {
    Object.assign(this, values);
  }
}
