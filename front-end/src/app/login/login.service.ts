import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environment/environment.dev';

@Injectable({
  providedIn: 'root'
})
export class LoginService {

  constructor(private _http: HttpClient) { }

  login(userDetails:Object) : Observable<any> {
    return this._http.post<any>(`${environment.urls.userProfileService}/login/user`, userDetails);
  }

}
