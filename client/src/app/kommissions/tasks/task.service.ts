import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Task } from '../../shared/models';
import { Observable } from 'rxjs';

@Injectable()
export class TaskService {

  constructor(private http: HttpClient) { }

  getTasks(id: number) : Observable<Task[]> {
    return this.http.get<Task[]>(`/api/v1/kommissions/${id}/tasks`);
  }

  getById(id: number): Observable<Task> {
    return this.http.get<Task>(`/api/v1/tasks/${id}`);
  }

  create(task: Task): Observable<Task> {
    return this.http.post<Task>('/api/v1/tasks', task);
  }

  update(task: Task): Observable<Task> {
    const tmpTask = task;
    delete tmpTask.barmen;
    delete tmpTask.createdAt;
    return this.http.put<Task>(`/api/v1/tasks/${task.id}`, task);
  }

  delete(id: number): Observable<Task> {
    return this.http.delete<Task>(`/api/v1/tasks/${id}`);
  }
}
