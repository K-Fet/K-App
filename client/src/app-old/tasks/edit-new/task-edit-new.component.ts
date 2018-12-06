import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { TaskService, ToasterService, KommissionService } from '../../_services';
import { Barman, Task, AssociationChanges, Kommission } from '../../_models';
import { TASK_STATES } from '../../_models/Task';

@Component({
  selector: 'app-task-edit-new',
  templateUrl: './task-edit-new.component.html',
})
export class TaskEditNewDialogComponent implements OnInit {

  oldTask: Task;
  taskForm: FormGroup;
  barmen: Barman[];
  states = TASK_STATES;

  selectedSate: string;
  selectedBarmen: number[];

  constructor(public dialogRef: MatDialogRef<TaskEditNewDialogComponent>,
              private fb: FormBuilder,
              private taskService: TaskService,
              private toasterService: ToasterService,
              @Inject(MAT_DIALOG_DATA) public data: { task?: Task, kommission: Kommission},
              private kommissionService: KommissionService) {
    if (data.task) {
      this.oldTask = data.task;
    }
  }

  createForm() {
    this.taskForm = this.fb.group({
      name: new FormControl(this.oldTask ? this.oldTask.name : '', [Validators.required]),
      deadline: new FormControl(this.oldTask ? this.oldTask.deadline : '', [Validators.required]),
      state: new FormControl(this.oldTask ? this.oldTask.state : '', [Validators.required]),
      description: new FormControl(this.oldTask ? this.oldTask.description : '', [Validators.required]),
      barmen: new FormControl(this.oldTask ? this.oldTask.barmen.map(b => b.id) : ''),
    });
  }

  ngOnInit () {
    this.kommissionService.getById(+this.data.kommission.id).subscribe((kommission) => {
      this.barmen = kommission.barmen.filter(b => new Barman(b).isActive());
    });
    this.createForm();
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  submitForm() {
    const selectedBarmen = this.taskForm.value.barmen;
    const task = new Task(this.taskForm.value);
    delete task.barmen;
    if (this.oldTask) {
      task.id = this.oldTask.id;
      task._embedded = {
        barmen: this.prepareAssociationChanges(this.oldTask.barmen, selectedBarmen),
      };
      this.taskService.update(task).subscribe(() => {
        this.toasterService.showToaster('Tâche modifiée');
        this.dialogRef.close(true);
      });
    } else {
      task._embedded = {
        barmen: { add: selectedBarmen },
        kommissionId: this.data.kommission.id,
      };
      if (selectedBarmen.length === 0) delete task._embedded.barmen;
      this.taskService.create(task).subscribe(() => {
        this.toasterService.showToaster('Tâche ajoutée');
        this.dialogRef.close(true);
      });
    }
  }

  prepareAssociationChanges(current, updated): AssociationChanges {
    const add: number[] = [];
    const remove: number[] = [];
    updated.forEach((aId) => {
      if (!current.map(a => a.id).includes(aId)) {
        add.push(aId);
      }
    });
    current.map((a) => {
      if (!updated.includes(a.id)) {
        remove.push(a.id);
      }
    });
    return { add, remove };
  }
}
