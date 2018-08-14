import { AssociationChanges, ConnectionInformation, Permission } from './index';

export class SpecialAccount {

  id: number;
  description: String;
  createdAt: Date;
  code: number;
  password: String;

  // Association
  connection: ConnectionInformation;
  permissions: Permission[];

  _embedded: {
    permissions?: AssociationChanges,
  };

  constructor(values: Object = {}) {
    Object.assign(this, values);
  }
}
