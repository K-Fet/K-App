export class ConnectionInformation {

  id?: number;
  email?: String;

  constructor(values: Object = {}) {
    Object.assign(this, values);
  }
}
