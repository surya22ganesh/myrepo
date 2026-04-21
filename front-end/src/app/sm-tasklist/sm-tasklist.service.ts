import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { SM } from '../sm';
import { environment } from 'src/environment/environment.dev';


@Injectable({
  providedIn: 'root',
})
export class SmTasklistService {



  constructor(private http: HttpClient) { };


  setAssignedStartDateTime(crqRef: String): Observable<any> {

    const token = localStorage.getItem('token');
    const headers = token ? { Authorization: `Bearer ${token}` } : undefined;

    return this.http.get<SM[]>(`${environment.urls.crqService}/crq/tasks/set-assigned-date-time/${crqRef}`, { headers });

  }

}
