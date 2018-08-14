import { Barman, SpecialAccount, Permission } from '.';

export class ConnectedUser {

  email?: String;
  createdAt?: Date;
  accountType: String;
  barman?: Barman;
  specialAccount?: SpecialAccount;
  permissions?: Permission[];

  constructor(values: Object = {}) {
    Object.assign(this, values);
  }

  public isGuest(): Boolean {
    return this.accountType === 'Guest' ? true : false;
  }

  public isBarman(): Boolean {
    return this.accountType === 'Barman' ? true : false;
  }
}
