import { Component, OnInit } from '@angular/core';
import { Task, ConnectedUser, Kommission } from '../../_models';
import { AuthService, BarmanService } from '../../_services';
import { MatDialog } from '@angular/material';
import { TaskViewDialogComponent } from '../view/task-view.component';
import { getPanelClass } from '../tasks.helpers';

@Component({
  selector: 'app-my-tasks',
  templateUrl: './my-tasks.component.html',
  styleUrls: ['./my-tasks.component.scss'],
})

export class MyTasksComponent implements OnInit {

  tasksGroupByKommissions: Kommission[];
  user: ConnectedUser;

  constructor(private authService: AuthService,
              private barmanService: BarmanService,
              private dialog: MatDialog) {
  }

  ngOnInit(): void {
    this.authService.$currentUser.subscribe((user: ConnectedUser) => {
      this.user = user;
      if (user.isBarman()) {
        this.refresh();
      }
    });
  }

  refresh(): void {
    this.barmanService.getTasks().subscribe((tasks: Task[]) => {
      this.tasksGroupByKommissions = tasks.length > 0 ? this.prepareTasks(tasks) : undefined;
    });
  }

  prepareTasks(tasks: Task[]) {
    const tasksGroupByKommissions: Kommission[] = [];
    tasks.forEach((task) => {
      if (tasksGroupByKommissions.indexOf(task.kommission) === -1) {
        const newTasks: Task[] = [];
        newTasks.push(task);
        tasksGroupByKommissions.push({
          ...task.kommission,
          tasks: newTasks,
        });
      } else {
        tasksGroupByKommissions[tasksGroupByKommissions.indexOf(task.kommission)].tasks.push(task);
      }
    });
    return tasksGroupByKommissions;
  }

  openViewDialog(kommission: Kommission, task: Task): void {
    const panelClass = getPanelClass(task);
    const viewDialogRef = this.dialog.open(TaskViewDialogComponent, {
      panelClass,
      data: { task, kommission },
      width: '500px',
    });
    viewDialogRef.afterClosed().subscribe(() => {
      this.refresh();
    });
  }
}
