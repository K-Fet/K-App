import { Barman, SpecialAccount } from './index';

export class ConnectedUser {

  username?: String;
  createdAt?: Date;
  accountType: String;
  barman?: Barman;
  specialAccount?: SpecialAccount;

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
