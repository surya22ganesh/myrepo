import { Injectable } from '@angular/core';

import { Observable } from 'rxjs';
import { SM } from '../sm';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environment/environment.dev';

@Injectable({
  providedIn: 'root'
})

export class DashboardService {

  constructor(private http: HttpClient) { };

  getActiveTasks(): Observable<any> {
    const token = localStorage.getItem('token');
    const headers = token ? { Authorization: `Bearer ${token}` } : undefined;
    return this.http.get<SM[]>(`${environment.urls}/v1/active`, { headers });
  }

  getAllTasks(crqNumber:String): Observable<any> {
    const token = localStorage.getItem('token');
    const headers = token ? { Authorization: `Bearer ${token}` } : undefined;
    return this.http.get<any[]>(`${environment.urls.crqService}/crq/getAllTasks/${crqNumber}`, { headers });
  }
  // getLatestStatus(): Observable<any> {
  //   const token = localStorage.getItem('token');
  //   const headers = token ? { Authorization: `Bearer ${token}` } : undefined;
  //   return this.http.get(`${environment.apiUrl}/v1/latest-status`, { headers });
  // }
}
