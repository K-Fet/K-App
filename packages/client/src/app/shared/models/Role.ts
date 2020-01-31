import { Permission } from './Permission';

export interface Role {

  _id?: string;
  createdAt?: Date;
  updatedAt?: Date;
  name: string;
  description?: string;
  permissions?: Permission[];
}
