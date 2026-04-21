import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environment/enivironment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AiServiceService {

  constructor(private http: HttpClient) { };


  predict(selectedComponentids: string[]): Observable<any> {
    const token = localStorage.getItem('token');
    const headers = token ? { Authorization: `Bearer ${token}` } : undefined;
    return this.http.post(`${environment.apiUrl}/v1/predict`, selectedComponentids, { headers, responseType: 'text' });
  }

  //  saveSelectedTasks(tasks: any[]) {
  //    const token = localStorage.getItem('token');
  //    const headers = token ? { Authorization: `Bearer ${token}` } : undefined;

  //    return this.http.post(`${environment.apiUrl}/v1/saveSelectedTasks`, tasks, { headers, responseType: 'text' });
  //  }

}
