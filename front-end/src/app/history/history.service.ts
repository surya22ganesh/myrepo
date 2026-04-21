import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from "src/environment/environment.dev";
import { CreateCrqService } from '../create-crq/create-crq.service';

@Injectable({
  providedIn: 'root',
})

export class HistoryService {

  crqNumber: string = "";

  crqTaskTableData: any[] = [];

  constructor(private _http: HttpClient, private _crqService: CreateCrqService) { }

  getCrqMainByDateWithHeaders(fromDate: String, toDate: String): Observable<any> {

    const baseHeaders = new HttpHeaders().set('x-Debug-Level', 'minimal');

    let fromToDates = new Object({
      "fromDate": fromDate,
      "toDate": toDate
    });

    return this._http.post<any>(`${environment.urls.crqService}/history/crq-main`
      , fromToDates
      , {
        observe: 'response' as const,
        headers: baseHeaders,
      });
  }

  getAllCrqs(): Observable<any> {

    const baseHeaders = new HttpHeaders().set('x-Debug-Level', 'minimal');

    return this._http.get<any>(
      `${environment.urls.crqService}/history/crq-main/all`,
      {
        observe: 'response' as const,
        headers: baseHeaders,
      }
    );
  }

}
