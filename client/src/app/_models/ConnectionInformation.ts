export class ConnectionInformation {

  id?: number;
  username?: string;

  constructor(values: Object = {}) {
    Object.assign(this, values);
  }
}
