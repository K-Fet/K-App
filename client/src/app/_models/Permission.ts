export class Permission {

  id: Number;
  name: String;
  disabled?: Boolean;

  constructor(values: Object = {}) {
    Object.assign(this, values);
  }
}
