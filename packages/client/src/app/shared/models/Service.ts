import { User } from '.';

export interface Service {
  _id?: string;
  createdAt?: Date;
  updatedAt?: Date;
  startAt: Date;
  endAt: Date;
  nbMax?: number;

  barmen?: string[] | User[];
}

export function isServicePassed(service: Service): boolean {
  return service.endAt.getTime() < Date.now();
}
