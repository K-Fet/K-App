export interface TemplateDateUnit {
  day: Number;
  hours: Number;
  minutes: Number;
}

export interface TemplateServiceUnit {
  nbMax: Number;
  startAt: TemplateDateUnit;
  endAt: TemplateDateUnit;
}

export class Template {

  id: Number;
  name: String;
  createdAt?: Date;
  updatedAt?: Date;
  deletedAt?: Date;
  services: TemplateServiceUnit[];

  constructor(values: Object = {}) {
    Object.assign(this, values);
  }
}
