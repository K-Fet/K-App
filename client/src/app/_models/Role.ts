import { AssociationChanges, Permission } from './index';

export class Role {

  id: number;
  name: String;
  description: String;

  // Association
  permissions: Permission[];

  _embedded: {
    permissions?: AssociationChanges,
  };

  constructor(values: Object = {}) {
    Object.assign(this, values);
  }
}
