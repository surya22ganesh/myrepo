import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environment/environment.dev';

@Injectable({
  providedIn: 'root'
})
export class CrqDraftService {

  private baseUrl = `${environment.urls.crqService}/crq/draft`;

  constructor(private http: HttpClient) { }

  saveDraft(data: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/save`, data, {
      responseType: 'text'
    });
  }

  getDraft(crqRef: string): Observable<any> {
    return this.http.get(`${this.baseUrl}/${crqRef}`);
  }

  deleteDraft(crqRef: string): Observable<any> {
    return this.http.delete(`${this.baseUrl}/${crqRef}`);
  }
}