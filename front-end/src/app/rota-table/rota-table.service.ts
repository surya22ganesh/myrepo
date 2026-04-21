import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from "src/environment/environment.dev";

@Injectable({
  providedIn: 'root',
})
export class RotaTableService {

  constructor(private _http: HttpClient) { }

  getRotaByCrqRef(crqRef: string): Observable<any> {
    return this._http.get<any>(`${environment.urls.crqService}/rota/${crqRef}`);
  }

}
