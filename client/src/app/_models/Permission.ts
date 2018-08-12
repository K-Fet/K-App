export class Permission {

  id: number;
  name: String;
  disabled?: Boolean;

  constructor(values: Object = {}) {
    Object.assign(this, values);
  }
}
