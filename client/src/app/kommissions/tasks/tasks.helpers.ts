import { Task } from '../../shared/models';

export function getPanelClass(task: Task) {
  switch (task.state) {
    case 'Not started':
      return 'notStarted';
    case 'In progress':
      return 'inProgress';
    case 'Abandoned':
      return 'abandoned';
    case 'Done':
      return 'done';
    default:
      return '';
  }
}
