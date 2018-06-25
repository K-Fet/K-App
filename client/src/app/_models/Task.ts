import { Barman, Kommission, AssociationChanges } from './index';

export class Task {
  id: Number;
  name: String;
  deadline: Date;
  state: String;
  description: String;
  createdAt: Date;
  kommission: Kommission;
  barmen: Barman[];

  _embedded: {
    barmen?: AssociationChanges;
    kommissionId?: Number;
  };

  constructor(values: Object = {}) {
    Object.assign(this, values);
  }
}

export const TASK_STATES = [{
  name: 'Non commencée',
  value: 'Not started',
}, {
  name: 'En cours',
  value: 'In progress',
}, {
  name: 'Abandonnée',
  value: 'Abandoned',
}, {
  name: 'Terminée',
  value: 'Done',
}];
