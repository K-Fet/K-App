export class Permission {

  id: number;
  name: string;
  disabled?: boolean;

  constructor(values: Object = {}) {
    Object.assign(this, values);
  }
}
