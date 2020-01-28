import { ExcludeMethods } from '../../../utils';

export interface TemplateServiceUnit {
  nbMax?: number;

  startDay: number;
  startHours: number;
  startMinutes: number;

  endDay: number;
  endHours: number;
  endMinutes: number;
}

export class Template {

  _id?: string;
  createdAt?: Date;
  updatedAt?: Date;
  name: string;
  services: TemplateServiceUnit[];

  constructor(values: ExcludeMethods<Template>) {
    Object.assign(this, values);
  }
}
