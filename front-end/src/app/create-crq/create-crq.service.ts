import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
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

  // readFile(file: File): Observable<any> {
  //   const token = localStorage.getItem('token');
  //   const headers = token ? { Authorization: `Bearer ${token}` } : undefined;


  //   const formData = new FormData();
  //   formData.append('file', file); // key = 'file'

  //   return this.http.post(`${environment.urls.crqService}/file/read`, formData, { headers, responseType: 'text' });

  // }

  saveCrqData(crqData: any): Observable<any> {
    const token = localStorage.getItem('token');
    const headers = token ? { Authorization: `Bearer ${token}` } : undefined;

     return this.http.post(`${environment.urls.crqService}/file/save`, crqData, { headers });
  }

  readCrqRef(file: File): Observable<any> {
    const token = localStorage.getItem('token');
    const headers = token ? { Authorization: `Bearer ${token}` } : undefined;


    const formData = new FormData();
    formData.append('file', file); // key = 'file'

    return this.http.post(`${environment.urls.crqService}/file/crq-ref`, formData, { headers, responseType: 'text' });

  }

  getTasksByCrqRef(crqRef: String): Observable<any> {

    const token = localStorage.getItem('token');
    const headers = token ? { Authorization: `Bearer ${token}` } : undefined;

    // return this.http.get<any[]>(`${environment.urls.crqService}/crq/tasks/${crqRef}`,
    return this.http.get<any>(`${environment.urls.crqService}/crq/get-crq-tasks/${crqRef}`,
      { headers });

  }

  getTasksByCrqRefByQuery(crqRef: String): Observable<any> {

    const token = localStorage.getItem('token');
    const headers = token ? { Authorization: `Bearer ${token}` } : undefined;

    const baseHeaders = new HttpHeaders().set('x-Debug-Level','minimal');
    const updatedHeaders = baseHeaders.set('x-Debug-Level', 'verbose');

    return this.http.get<any>(`${environment.urls.crqService}/crq/get-crq-tasks/${crqRef}`,
      {
        observe: 'response' as const,
        // params: HttpParams,
        headers: baseHeaders,
    });

  }
  // getTasksByCrqRefByQuery(crqRef: String): Observable<any> {

  //   const token = localStorage.getItem('token');
  //   const headers = token ? { Authorization: `Bearer ${token}` } : undefined;

  //   return this.http.get<any>(`${environment.urls.crqService}/crq/get-crq-tasks/${crqRef}`, { headers });

  // }

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

  startProcessInstance(crqRef: string): Observable<any> {
    return this.http.get<string>(`${environment.urls.camundaService}/process-instance/start/${crqRef}`);
  }

  // old api
  saveSelectedTasks(tasks: any) {
    const token = localStorage.getItem('token');
    const headers = token ? { Authorization: `Bearer ${token}` } : undefined;

    return this.http.post(`${oldEnv.apiUrl}/v1/saveSelectedTasks`, tasks, { headers, responseType: 'text' });
  }

}
