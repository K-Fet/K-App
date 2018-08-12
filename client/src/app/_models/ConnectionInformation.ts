export class ConnectionInformation {

  id?: number;
  username?: String;

  constructor(values: Object = {}) {
    Object.assign(this, values);
  }
}
