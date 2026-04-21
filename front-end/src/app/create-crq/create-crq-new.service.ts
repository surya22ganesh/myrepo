import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { SM } from '../sm';
import { environment as oldEnv } from 'src/environment/enivironment';
import { environment } from 'src/environment/environment.dev';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CreateCrqService {

  tasks: SM[] = [];
  selectedTemplate: string = 'Template1';

  constructor(private http: HttpClient) { };

  uploadFile(file: File): Observable<any> {
    const token = localStorage.getItem('token');
    const headers = token ? { Authorization: `Bearer ${token}` } : undefined;


    const formData = new FormData();
    formData.append('file', file); // key = 'file'

    return this.http.post(`${environment.urls.crqService}/file/upload`, formData, { headers, responseType: 'text' });

  }

  readFile(file: File): Observable<any> {
    const token = localStorage.getItem('token');
    const headers = token ? { Authorization: `Bearer ${token}` } : undefined;


    const formData = new FormData();
    formData.append('file', file); // key = 'file'

    return this.http.post(`${environment.urls.crqService}/v2/file/read`, formData, { headers });

  }

  saveCrqData(crqData: any): Observable<any> {
    const token = localStorage.getItem('token');
    const headers = token ? { Authorization: `Bearer ${token}` } : undefined;

    return this.http.post(`${environment.urls.crqService}/v2/file/save`, crqData, { headers });
  }

  // assignTasks(taskIds: number[] | number) {
  //   const token = localStorage.getItem('token');
  //   const headers = token ? { Authorization: `Bearer ${token}` } : undefined;

  //   const url = `${environment.urls.crqService}/crq/assignee`;

  //   const body = Array.isArray(taskIds) ? taskIds : [taskIds];

  //   console.log("Payload sent to assign:", body); // ✅ debug

  //   return this.http.post(url, body, { headers });
  // }

  getTasksByCrqRef(crqRef: String): Observable<any> {

    const token = localStorage.getItem('token');
    const headers = token ? { Authorization: `Bearer ${token}` } : undefined;

    return this.http.get<SM[]>(`${environment.urls.crqService}/crq/tasks/${crqRef}`, { headers });

  }

  markIsStartedToTrue(crqRef: String | null): Observable<any> {
    const token = localStorage.getItem('token');
    const headers = token ? { Authorization: `Bearer ${token}` } : undefined;
    return this.http.patch<any>(`${environment.urls.crqService}/crq/mark-active/${crqRef}`, { headers });
  }


  checkAlreadyUploadedCrq(crqRef: string): Observable<any> {
    const token = localStorage.getItem('token');
    const headers = token ? { Authorization: `Bearer ${token}` } : undefined;

    return this.http.get<Boolean>(`${environment.urls.crqService}/crq-main/check/${crqRef}`);
  }

  // startProcessInstance(crqRef: string): Observable<any> {
  //   return this.http.get<string>(`${environment.urls.camundaService}/process-instance/start/${crqRef}`);
  // }
  startProcessInstance(crqRef: string): Observable<any> {
    return this.http.post(`${environment.urls.camundaService}/process-instance/start/message/${crqRef}`,
      {}, { responseType: 'text' }
    );
  }

  // old api
  saveSelectedTasks(tasks: any) {
    const token = localStorage.getItem('token');
    const headers = token ? { Authorization: `Bearer ${token}` } : undefined;

    return this.http.post(`${oldEnv.apiUrl}/v1/saveSelectedTasks`, tasks, { headers, responseType: 'text' });
  }


  previewRotaFile(file: File) {
    const formData = new FormData();
    formData.append('file', file);

    return this.http.post(
      `${environment.urls.crqService}/v2/file/read-rota`,
      formData
    );
  }

  saveRotaFile(file: File, crqNumber: string, createdBy: string) {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('crqNumber', crqNumber);
    formData.append('createdBy', createdBy);

    return this.http.post(
      `${environment.urls.crqService}/v2/file/rota-save`,
      formData,
      { responseType: 'text' }
    );
  }

  smtpSendMail(crqTasks: any) {
  return this.http.post(`${environment.urls.outBoundNotificationService}/smtp/teams/`, crqTasks);
}



}
