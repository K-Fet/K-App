import { NgModule } from '@angular/core';

import { SharedModule } from '../../shared/shared.module';
import { TaskEditNewDialogComponent } from './edit-new/task-edit-new.component';
import { TasksListComponent } from './list/tasks-list.component';
import { TaskViewDialogComponent } from './view/task-view.component';
import { MyTasksComponent } from './my-tasks/my-tasks.component';
import { TaskService } from './task.service';

@NgModule({
  declarations: [
    TaskEditNewDialogComponent,
    TasksListComponent,
    TaskViewDialogComponent,
    MyTasksComponent,
  ],
  providers: [
    TaskService,
  ],
  imports: [
    SharedModule,
  ],
  entryComponents: [
    TaskViewDialogComponent,
    TaskEditNewDialogComponent,
  ],
  exports: [
    MyTasksComponent,
    TasksListComponent,
  ],
})
export class TasksModule {}
