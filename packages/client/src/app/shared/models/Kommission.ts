import { User } from './User';

export interface Kommission {
  _id?: string;
  createdAt?: Date;
  updatedAt?: Date;
  name: string;
  description?: string;

  barmen: string[] | User[];
}
