import { Barman, Kommission, AssociationChanges } from '.';

export class Task {
  id: number;
  name: string;
  deadline: Date;
  state: string;
  description: string;
  createdAt: Date;
  kommission: Kommission;
  barmen: Barman[];

  _embedded: {
    barmen?: AssociationChanges;
    kommissionId?: number;
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
