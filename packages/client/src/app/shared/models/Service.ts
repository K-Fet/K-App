import { Barman } from '.';

export interface Service {
  _id?: string;
  createdAt?: Date;
  updatedAt?: Date;
  startAt: Date;
  endAt: Date;
  nbMax?: number;

  barmen?: string[] | Barman[];
}

export function isServicePassed(service: Service): boolean {
  return service.endAt.getTime() < Date.now();
}
