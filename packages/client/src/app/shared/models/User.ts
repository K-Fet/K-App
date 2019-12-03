import { Kommission } from './Kommission';
import { Role } from './Role';
import { Service } from './Service';
import { ExcludeMethods } from '../../../utils';

export class Barman {
  firstName: string;
  lastName: string;
  nickName: string;
  leaveAt?: Date;
  facebook: string;
  godFather?: string & Barman;
  dateOfBirth: Date;
  flow: string;
  createdAt: Date;
  updatedAt: Date;

  kommissions: string[] & Kommission[];
  roles: string[] & Role[];
  services: string[] & Service[];
}

export class ServiceAccount {
  code: string;
  description: string;
  permissions: string[];
}

export class User {

  _id?: number;
  email?: string;
  accountType: 'SERVICE' | 'BARMAN' | 'GUEST' = 'GUEST';
  account: (Barman & ServiceAccount) | null;
  permissions?: string[];
  createdAt?: Date;
  updatedAt?: Date;

  constructor(values: ExcludeMethods<User>) {
    Object.assign(this, values);
  }

  public isGuest(): boolean {
    return this.accountType === 'GUEST';
  }

  public isBarman(): boolean {
    return this.accountType === 'BARMAN';
  }

  public isServiceAccount(): boolean {
    return this.accountType === 'SERVICE';
  }
}
