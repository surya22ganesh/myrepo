import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Observable } from 'rxjs';
import { Employee } from './employee';
import { environment } from 'src/environment/enivironment';


@Injectable({
  providedIn: 'root'
})
export class EmployeeService {



  private baseURL = `${environment.apiUrl}/v1/employees`;
  http: any;

  constructor(private httpClient: HttpClient) { }

  getEmployeesList(): Observable<Employee[]> {
    return this.httpClient.get<Employee[]>(`${this.baseURL}`);
  }

  addEmployee(employee: Employee): Observable<Object> {
    return this.httpClient.post(`${this.baseURL}`, employee);
  }

  getEmployeeById(id: number): Observable<Employee> {
    return this.httpClient.get<Employee>(`${this.baseURL}/${id}`);
  }


  updateEmployee(id: number, employee: Employee): Observable<Object> {
    return this.httpClient.put(`${this.baseURL}/${id}`, employee);
  }

  deleteEmployee(id: number): Observable<Object> {
    return this.httpClient.delete(`${this.baseURL}/${id}`);
  }
  sendEmployees(ids: number[]): Observable<any> {
    return this.http.post(`${environment.apiUrl}/v1/employees/send-employees`, ids);
  }

}
