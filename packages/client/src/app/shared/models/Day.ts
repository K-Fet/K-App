import { Service } from '.';

export interface Day {
  name: string;
  date: Date;
  active: boolean;
  services: Service[];
}
