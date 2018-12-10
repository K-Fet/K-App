import { Barman, SpecialAccount, Permission } from '.';

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
}
