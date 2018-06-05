export class Kommission {

  id: Number;
  name: String;
  description: String;

  constructor(values: Object = {}) {
    Object.assign(this, values);
  }
}
