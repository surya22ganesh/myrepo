import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environment/environment.dev';


@Injectable({
  providedIn: 'root'
})
export class TeamService {



  constructor(private http: HttpClient) { }

  sendTeamDetails(payload: any): Observable<any> {

    const token = localStorage.getItem('token');
    const headers = token ? { Authorization: `Bearer ${token}` } : undefined;
    return this.http.post(`${environment.urls.camundaService}/teams/send`, payload, {
      headers,
      responseType: 'text'
    });
  }
}