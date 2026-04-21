import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { environment } from "src/environment/environment.dev";



export interface Task {
  id: string;
  name: string;
  taskDefinitionId: string;
  processName: string;
  creationDate: string;
  completionDate: string | null;
  assignee: string;
  taskState: string;
  formKey: string;
  formId: string;
  formVersion: number;
  processInstanceKey: string;
  processDefinitionKey: string;
  processInstanceId: string;
}
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
export class TaskService {



  constructor(private http: HttpClient) { }

  private getHeaders(): HttpHeaders {
    const token = localStorage.getItem('token'); // Or sessionStorage if you use that
    console.log(token)
    return new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    });

  }

  saveStatusComments(request: StatusCommentsRequest): Observable<StatusCommentsResponse[]> {
    return this.http.post<StatusCommentsResponse[]>(environment.urls.camundaService, request);
  }

  getLatestTasks(): Observable<any> {
    return this.http.get<any>(`http://localhost:9090/api/v1/tasks/latest`);
  }

  getTasks(assignee: string): Observable<any> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    });
    const userEmail = localStorage.getItem('user_email');

    // const body = {
    //   sort: [{ field: "creationTime", order: "ASC" }],
    //   pageSize: 50,
    //   assigned: true,
    //   assignee: userEmail,
    //   state: "CREATED"
    // };

    const body = {
      state: "CREATED",
      processDefinitionId: "ReleaseX_Event_Subprocess_Main_Flow",
      pageSize: 100,
      sort: [
        { field: "creationTime", order: "ASC" }
      ]
    };


    return this.http.post(`${environment.urls.camundaService}/process-instance/search`, body, { headers });

  }


  assignTask(taskId: string, userId: string): Observable<any> {
    return this.http.post(`${environment.urls.camundaService}/process-instance/${taskId}/assign?userId=${userId}`, {}, {
      headers: this.getHeaders()
    });
  }

  unassignTask(taskId: string): Observable<any> {
    return this.http.delete(`${environment.urls.camundaService}/process-instance/${taskId}/unassign`, {
      headers: this.getHeaders()
    });
  }

  // completeTask(taskId: string, variables: any): Observable<any> {
  //   return this.http.post(`${environment.urls.camundaService}/${taskId}/complete`, { variables }, {
  //     headers: this.getHeaders()
  //   });
  // }
  // completeTask(taskId: string, executeDeployment: string) {
  // const body = {

  //     executeDeployment: executeDeployment }


  // return this.http.post(`${environment.urls.camundaService}/${taskId}/complete`, body);
  // }
  completeTask(taskId: string, executeDeployment: string) {
    // ✅ Send correct Camunda variables format
    const body = {

      executeDeployment: executeDeployment

    };
    return this.http.post(`${environment.urls.camundaService}/process-instance/${taskId}/complete`, body);
  }


  fetchTaskVariables(taskId: string): Observable<any[]> {
    const headers = this.getHeaders();

    const body = {
      state: "CREATED",
      taskVariables: [
        {
          name: "task",
          operator: "eq"
        }
      ],
      pageSize: 50
    };

    return this.http.post<any[]>(
      `${environment.urls.camundaService}/process-instance/${taskId}/fetchVariables`,
      body,
      { headers }
    );
  }


  saveStatus(payload: any) {
    const headers = this.getHeaders();
    return this.http.put(`${environment.urls.crqService}/rag-status/open`, payload, { headers });
  }

  saveRagStatusComments(payload: any) {
    const headers = this.getHeaders();
    return this.http.put(`${environment.urls.crqService}/rag-status/save`, payload, { headers });
  }
  smtpSendMail(crqTasks: any) {

    return this.http.post(`${environment.urls.outBoundNotificationService}/smtp/teams/`, crqTasks);
  }
  notifyBackend(payload: any) {
  return this.http.post(`${environment.urls.crqService}/rag-status/notify`, payload);
}

  getTasksByRoles(roles: string[]) {
    const headers = this.getHeaders();
    return this.http.post<any[]>(
      `${environment.urls.crqService}/crq/by-roles`,
      roles,
      { headers }
    );
  }

  getTasksFromDB(roles: string[]): Observable<any[]> {
    return this.http.post<any[]>(
      `${environment.urls.crqService}/crq/active`,
      roles,
      { headers: this.getHeaders() }
    );
  }


}
