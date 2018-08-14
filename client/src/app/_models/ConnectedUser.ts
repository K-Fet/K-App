import { Barman, SpecialAccount, Permission } from './index';

export class ConnectedUser {

  username?: string;
  createdAt?: Date;
  accountType: string;
  barman?: Barman;
  specialAccount?: SpecialAccount;
  permissions?: Permission[];

  constructor(values: Object = {}) {
    Object.assign(this, values);
  }

  public isGuest(): boolean {
    return this.accountType === 'Guest' ? true : false;
  }

  public isBarman(): boolean {
    return this.accountType === 'Barman' ? true : false;
  }
}
