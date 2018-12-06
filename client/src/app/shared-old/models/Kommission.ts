import { Barman } from './Barman';
import { Task } from './Task';

export class Kommission {

  id: number;
  name: string;
  description: string;
  barmen: Barman[];
  tasks: Task[];

  constructor(values: Object = {}) {
    Object.assign(this, values);
  }
}
