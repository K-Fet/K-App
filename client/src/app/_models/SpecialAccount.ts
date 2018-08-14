import { AssociationChanges, ConnectionInformation, Permission } from '.';

export class SpecialAccount {

  id: number;
  description: string;
  createdAt: Date;
  code: number;
  password: string;

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
