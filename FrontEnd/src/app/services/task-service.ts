import { Injectable } from '@angular/core';
import { TaskItem } from '../models/task-item.model';
import { Observable } from 'rxjs/internal/Observable';
import { HttpClient, HttpParams } from '@angular/common/http';
import { TaskDto } from '../models/task-dto';
import { CreateTaskDto } from '../models/create-task-dto';
import { TaskItemStatus } from '../models/task-item-status';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})

export class TaskService {
  private apiUrl = `${environment.apiUrl}/Task`;
  constructor(private http: HttpClient) { }

  getAll(status?: TaskItemStatus) {
    let params = new HttpParams();
    if (status !== undefined && status !== null) {
      params = params.set('status', status);
    }
    return this.http.get<TaskItem[]>(this.apiUrl, { params });
  }

  getById(id: number): Observable<TaskDto> {
    return this.http.get<TaskDto>(`${this.apiUrl}/${id}`);
  }

  createTask(dto: CreateTaskDto): Observable<TaskDto> {
    return this.http.post<TaskDto>(this.apiUrl, dto);
  }

  updateTask(id: number, dto: any): Observable<TaskDto> {
    return this.http.put<TaskDto>(`${this.apiUrl}/${id}`, dto);
  }

  deleteById(id: number) {
    return this.http.delete<TaskDto>(`${this.apiUrl}/${id}`);
  }

}
