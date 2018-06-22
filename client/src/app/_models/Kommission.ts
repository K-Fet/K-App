import { Barman } from './Barman';
import { Task } from './Task';

export class Kommission {

  id: Number;
  name: String;
  description: String;
  barmen: Barman[];
  tasks: Task[];

  constructor(values: Object = {}) {
    Object.assign(this, values);
  }
}
