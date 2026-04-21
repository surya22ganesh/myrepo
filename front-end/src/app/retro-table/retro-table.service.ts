import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from "src/environment/environment.dev";

@Injectable({
    providedIn: 'root'
})
export class RetroTableService {

    constructor(private _http: HttpClient) { }

    getRetroByCrqRef(crqRef: string) {
        return this._http.get<any>(
            `${environment.urls.crqService}/retro/fetch/${crqRef}`
        );
    }
}