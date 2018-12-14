import { Barman, SpecialAccount, Permission, ConnectionInformation } from '.';

export class ConnectedUser {

  email?: string;
  createdAt?: Date;
  accountType: string;
  barman?: Barman;
  specialAccount?: SpecialAccount;
  permissions?: Permission[];

  constructor(values: Object = {}) {
    Object.assign(this, values);
  }

  public isGuest(): boolean {
    return this.accountType === 'Guest';
  }

  public isBarman(): boolean {
    return this.accountType === 'Barman';
  }

  public getConnection(): ConnectionInformation {
    if (this.specialAccount) return this.specialAccount.connection;
    if (this.barman) return this.barman.connection;
    return null;
  }
}
