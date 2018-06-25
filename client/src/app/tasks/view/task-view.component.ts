import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialog } from '@angular/material';
import { Task, Kommission, TASK_STATES } from '../../_models';
import { TaskEditNewDialogComponent } from '../edit-new/task-edit-new.component';
import { TaskService, ToasterService } from '../../_services';

@Component({
  selector: 'app-task-view',
  templateUrl: './task-view.component.html',
  styleUrls: ['./task-view.component.scss'],
})
export class TaskViewDialogComponent implements OnInit {

  constructor(public dialogRef: MatDialogRef<TaskViewDialogComponent>,
              @Inject(MAT_DIALOG_DATA) public data: { task?: Task, kommission: Kommission},
              private dialog: MatDialog,
              private taskService: TaskService,
              private toasterService: ToasterService) { }

  ngOnInit () {
  }

  getState(state): String {
    return TASK_STATES.find(s => s.value === state).name;
  }

  isPassed(): String {
    return new Date(this.data.task.deadline) < new Date() && this.data.task.state !== 'Done' ?
      'accent' : '';
  }

  markAsDone() {
    const task = new Task({ id: this.data.task.id, state: 'Done' });
    this.taskService.update(task).subscribe(() => {
      this.toasterService.showToaster('Tâche marquée comme terminée');
      this.dialogRef.close();
    });
  }

  openEditDialog() {
    const editNewDialogRef = this.dialog.open(TaskEditNewDialogComponent, {
      data: this.data,
      width: '500px',
    });
    editNewDialogRef.afterClosed().subscribe((updated) => {
      if (updated) {
        this.dialogRef.close();
      }
    });
  }
}
