import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Task } from '../_models';
import { Observable } from 'rxjs';

@Injectable()
export class TaskService {

  constructor(private http: HttpClient) { }

  getTasks(id: number) : Observable<Array<Task>> {
    return this.http.get<Array<Task>>(`/api/kommissions/${id}/tasks`);
  }

  getById(id: Number): Observable<Task> {
    return this.http.get<Task>(`/api/tasks/${id}`);
  }

  create(task: Task): Observable<Task> {
    return this.http.post<Task>(`/api/tasks`, task);
  }

  update(task: Task): Observable<Task> {
    return this.http.put<Task>(`/api/tasks/${task.id}`, task);
  }

  delete(id: Number): Observable<Task>{
      return this.http.delete<Task>(`/api/tasks/${id}`);
  }

}
