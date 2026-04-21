import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface StatusCommentDTO {
  status: string;
  comments?: string;
  selectTaskId: number;
}

export interface StatusCommentsRequest {
  comments: StatusCommentDTO[];
}

export interface StatusCommentsResponse {
  status: string;
  comments: string;
  rag: string;
  selectTaskId: number;
}

@Injectable({
  providedIn: 'root'
})
export class TaskdetailsService {
  private apiUrl = 'http://localhost:9090/api/v1/save-status-comments'; // adjust backend URL

  constructor(private http: HttpClient) { }

  saveStatusComments(request: StatusCommentsRequest): Observable<StatusCommentsResponse[]> {
    return this.http.post<StatusCommentsResponse[]>(this.apiUrl, request);
  }

  getLatestTasks(): Observable<any> {
    return this.http.get<any>(`http://localhost:9090/api/v1/tasks/latest`);
  }

}
