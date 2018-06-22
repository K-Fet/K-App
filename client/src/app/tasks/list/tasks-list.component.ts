import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource, MatSort, MatPaginator, MatDialog } from '@angular/material';

import { Task, Kommission } from '../../_models/index';
import { TaskService, ToasterService, KommissionService } from '../../_services/index';
import { TaskViewDialogComponent } from '../view/task-view.component';
import { TaskEditNewDialogComponent } from '../edit-new/task-edit-new.component';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-tasks',
  templateUrl: './tasks-list.component.html',
  styleUrls: ['./tasks-list.component.scss'],
})
export class TasksListComponent implements OnInit {

  kommission: Kommission;
  tasksData: MatTableDataSource<Task>;
  displayedColumns = ['state', 'name', 'deadline'];

  constructor (private taskService: TaskService,
               private toasterService: ToasterService,
               private kommissionService: KommissionService,
               private route: ActivatedRoute,
               private dialog: MatDialog) {}

  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;

  ngOnInit () {
    this.route.params.subscribe((params) => {
      this.kommissionService.getById(params['id']).subscribe((kommission) => {
        this.kommission = kommission;
        this.refresh();
      });
    });
  }

  refresh () {
    this.taskService.getTasks(this.kommission.id).subscribe((tasks) => {
      this.tasksData = new MatTableDataSource(this.sortByState(tasks));
      this.tasksData.paginator = this.paginator;
      this.tasksData.sort = this.sort;
    });
  }

  sortByState (tasks: Task[]) {
    return tasks.sort((t1, t2) => {
      const indice1 = this.getIndice(t1.state);
      const indice2 = this.getIndice(t2.state);
      if (indice1 < indice2) {
        return 1;
      }
      if (indice1 > indice2) {
        return -1;
      }
      return 0;
    });
  }

  private getIndice(state: String): Number {
    switch (state) {
      case 'Abandoned':
        return 1;
      case 'Done':
        return 2;
      case 'In progress':
        return 3;
      case 'Not started':
        return 4;
    }
  }

  markAsDone (task) {
    task.state = task.state === 'Done' ? 'Not started' : 'Done';
    this.taskService.update(task).subscribe(() => {
      this.toasterService.showToaster('Tâche mise à jour');
      this.refresh();
    });
  }

  openViewDialog(task: Task): void {
    const panelClass = this.getPanelClass(task);
    const viewDialogRef = this.dialog.open(TaskViewDialogComponent, {
      panelClass,
      data: { task, kommission: this.kommission },
      width: '500px',
    });
    viewDialogRef.afterClosed().subscribe(() => {
      this.refresh();
    });
  }

  getPanelClass(task: Task) {
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

  getFrenchState(task: Task) {
    switch (task.state) {
      case 'Not started':
        return 'Non commencée';
      case 'In progress':
        return 'En cours';
      case 'Abandoned':
        return 'Abandonnée';
      case 'Done':
        return 'Terminée';
      default:
        return '';
    }
  }

  openNewDialog() {
    const editNewDialogRef = this.dialog.open(TaskEditNewDialogComponent, {
      data: { kommission: this.kommission },
      width: '500px',
    });
    editNewDialogRef.afterClosed().subscribe((created) => {
      if (created) {
        this.refresh();
      }
    });
  }
}
