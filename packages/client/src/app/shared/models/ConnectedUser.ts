import { Barman, SpecialAccount, Permission, ConnectionInformation } from '.';

export enum AccountType {
  GUEST,
  BARMAN,
  SPECIAL_ACCOUNT,
}

export class ConnectedUser {

  email?: string;
  createdAt?: Date;
  accountType: AccountType;
  barman?: Barman;
  specialAccount?: SpecialAccount;
  permissions?: Permission[];

  constructor(values: Object = {}) {
    Object.assign(this, values);
  }

  public isGuest(): boolean {
    return this.accountType === AccountType.GUEST;
  }

  public isBarman(): boolean {
    return this.accountType === AccountType.BARMAN;
  }

  public isSpecialAccount(): boolean {
    return this.accountType === AccountType.SPECIAL_ACCOUNT;
  }

  public getConnection(): ConnectionInformation {
    if (this.specialAccount) return this.specialAccount.connection;
    if (this.barman) return this.barman.connection;
    return null;
  }
}
