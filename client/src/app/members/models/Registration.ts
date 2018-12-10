export class Registration {

  id: number;
  year: number;

  constructor(values: Object = {}) {
    Object.assign(this, values);
  }
}
