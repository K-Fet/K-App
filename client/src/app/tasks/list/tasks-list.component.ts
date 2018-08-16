import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource, MatSort, MatPaginator, MatDialog } from '@angular/material';

import { Task, Kommission, TASK_STATES } from '../../_models';
import { TaskService, ToasterService, KommissionService } from '../../_services';
import { TaskViewDialogComponent } from '../view/task-view.component';
import { TaskEditNewDialogComponent } from '../edit-new/task-edit-new.component';
import { ActivatedRoute } from '@angular/router';
import { FormControl } from '@angular/forms';
import { getPanelClass } from '../tasks.helpers';

@Component({
  selector: 'app-tasks-list',
  templateUrl: './tasks-list.component.html',
  styleUrls: ['./tasks-list.component.scss'],
})
export class TasksListComponent implements OnInit {

  kommission: Kommission;
  tasks: Task[];
  tasksData: MatTableDataSource<Task>;
  displayedColumns = ['state', 'name', 'deadline'];
  stateFilter: string[];
  states = TASK_STATES;
  stateSelected: FormControl;

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
    this.stateSelected = new FormControl('');
    this.stateSelected.valueChanges.subscribe((value) => {
      this.filterByState(value);
    });
  }

  filterByState(states: string[]) {
    const filteredTasks = states.length !== 0 ? this.tasks.filter(t => states.includes(t.state)) : this.tasks;
    this.tasksData = new MatTableDataSource(filteredTasks);
    this.tasksData.paginator = this.paginator;
    this.tasksData.sort = this.sort;
  }

  refresh () {
    this.taskService.getTasks(this.kommission.id).subscribe((tasks) => {
      this.tasks = tasks;
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

  private getIndice(state: string): number {
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
    const panelClass = getPanelClass(task);
    const viewDialogRef = this.dialog.open(TaskViewDialogComponent, {
      panelClass,
      data: { task, kommission: this.kommission },
      width: '500px',
    });
    viewDialogRef.afterClosed().subscribe(() => {
      this.refresh();
    });
  }

  // For template usage
  getPanelClass(task: Task) {
    return getPanelClass(task);
  }

  // For template usage
  getFrenchState(task: Task) {
    return this.states.find(s => s.value === task.state).name || 'Unknown state';
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
