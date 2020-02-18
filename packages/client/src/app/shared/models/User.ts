import { Kommission } from './Kommission';
import { Role } from './Role';
import { Service } from './Service';
import { Permission } from './Permission';

export interface Barman {
  firstName: string;
  lastName: string;
  nickName: string;
  leaveAt?: Date;
  facebook?: string;
  godFather?: string | Barman;
  dateOfBirth: Date;
  flow?: string;
  createdAt?: Date;
  updatedAt?: Date;

  kommissions: string[] | Kommission[];
  roles: string[] | Role[];
  services: string[] | Service[];
}

export interface ServiceAccount {
  code: string;
  description: string;
  permissions: Permission[];
}

export enum AccountType {
  SERVICE = 'SERVICE',
  BARMAN = 'BARMAN',
  GUEST = 'GUEST',
}

export interface User {
  _id?: string;
  email?: string;
  accountType: AccountType;
  account: Barman | ServiceAccount | null;
  permissions?: string[];
  createdAt?: Date;
  updatedAt?: Date;
}

export function isUserGuest(user: User): boolean {
  return user.accountType === AccountType.GUEST;
}

export function isUserBarman(user: User): boolean {
  return user.accountType === AccountType.BARMAN;
}

export function isActiveBarman(user: User): boolean {
  if (!isUserBarman(user)) return false;

  const barman = user.account as Barman;
  if (!barman.leaveAt) return true;
  return Date.now() < barman.leaveAt.getTime();
}

export function isUserServiceAccount(user: User): boolean {
  return user.accountType === AccountType.SERVICE;
}
