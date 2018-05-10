import { Component, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material';

import { Task } from '../../_models/index';
import { TaskService } from '../../_services/index';
//import { Router } from '@angular/router';


@Component({
    selector: 'app-tasks',
    templateUrl: './tasks-list.component.html',
    styleUrls: ['./tasks-list.component.scss'],
})
export class TasksListComponent implements OnInit {

    tasksData: MatTableDataSource<Task>;

    constructor (private taskService: TaskService){ }

    ngOnInit () {
      this.taskService.getTasks(1).subscribe(tasks=> { // id provisoire
        this.tasksData = new MatTableDataSource(tasks);
      })

    }

}
