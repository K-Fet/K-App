import { AssociationChanges, Permission } from './index';

export class Role {

  id: number;
  name: string;
  description: string;

  // Association
  permissions: Permission[];

  _embedded: {
    permissions?: AssociationChanges,
  };

  constructor(values: Object = {}) {
    Object.assign(this, values);
  }
}
