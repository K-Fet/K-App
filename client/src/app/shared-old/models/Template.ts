export interface TemplateDateUnit {
  day: number;
  hours: number;
  minutes: number;
}

export interface TemplateServiceUnit {
  nbMax: number;
  startAt: TemplateDateUnit;
  endAt: TemplateDateUnit;
}

export class Template {

  id: number;
  name: string;
  createdAt?: Date;
  updatedAt?: Date;
  deletedAt?: Date;
  services: TemplateServiceUnit[];

  constructor(values: Object = {}) {
    Object.assign(this, values);
  }
}
