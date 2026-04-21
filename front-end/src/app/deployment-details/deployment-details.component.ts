import { Component } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';

import { Employee } from '../employee';
import { EmployeeService } from '../employee.service';
import { environment } from 'src/environment/enivironment';

// PrimeNG modules
import { TableModule } from 'primeng/table';

import { ButtonModule } from 'primeng/button';
import { SelectModule } from 'primeng/select';

@Component({
  selector: 'app-employee-list',
  templateUrl: './deployment-details.component.html',
  styleUrls: ['./deployment-details.component.css'],
  standalone: true,
  imports: [CommonModule, FormsModule, DatePipe, TableModule, SelectModule, ButtonModule]
})
export class DeploymentDetailsComponent {
  role: string = '';
  statuslist = ['In-Progress', 'Closed'];
  employees: Employee[] = [];
  EnteredID!: number;

  comments: any[] = [];
  selectedComments: any[] = [];
  showModal = false;

  constructor(
    private employeeService: EmployeeService,
    private router: Router,
    private http: HttpClient
  ) {}

  ngOnInit(): void {
    this.role = localStorage.getItem('role') || '';
    this.getEmployees();
    this.getComments();
    this.getUnsubmittedEmployees();
  }

  // … keep all your methods as-is …



  openCommentModal(email: string) {
  this.http.get<any[]>(`${environment.apiUrl}/comments/by-email/${email}`)
    .subscribe(data => {
      this.selectedComments = data;
      this.showModal = true;
    });
}

closeModal() {
  this.showModal = false;
  this.selectedComments = [];
}

getComments() {
  this.http.get<any[]>(`${environment.apiUrl}/comments`)
    .subscribe(data => {
      this.comments = data;
    });
}

getCommentForEmployee(employee: Employee): string {
  const comment = this.comments.find(c => c.email === employee.email);
  return comment ? comment.comment : '';
}

  goToEmployee(){


    console.log(this.EnteredID);
    this.router.navigate(['details-of-employee',this.EnteredID]);
  }

  getEmployees(){
    this.employeeService.getEmployeesList().subscribe(data => {this.employees = data;});


  }

  updateEmployee(id: number){
    this.router.navigate(['updating-by-id', id]);
  }

updateStatus(employee: Employee) {
  this.http.put(`${environment.apiUrl}/v1/employees/${employee.id}`, employee)
    .subscribe({
      next: () => console.log(`✅ Status updated for ID ${employee.id}`),
      error: (err) => console.error(`❌ Error updating status for ID ${employee.id}:`, err)
    });
}



  deleteEmployee(id: number){

    if(confirm("Are you sure to delete Employee ID: "+id)){
    this.employeeService.deleteEmployee(id).subscribe( data => {
      console.log(data);
      this.getEmployees();
    })}
  }


  detailsOfEmployee(id: number){
    this.router.navigate(['details-of-employee', id]);
  }

  selectAll: boolean = false;

toggleAllSelection() {
  this.employees.forEach(emp => emp.selected = this.selectAll);
}


isAnySelected(): boolean {
  return this.employees?.some(emp => emp.selected);
}
getUnsubmittedEmployees() {
  const token = localStorage.getItem('token'); // ✅ get JWT
  const headers = { Authorization: `Bearer ${token}` }
  this.http.get<Employee[]>(`${environment.apiUrl}/v1/unsubmitted`,{ headers })
    .subscribe(data => {
      this.employees =data.map(emp => ({
      ...emp,
      status: emp.status || null
        }));
    });
  }

sendSelectedEmployees() {
  const token = localStorage.getItem('token');
const headers = { Authorization: `Bearer ${token}` };
  const selectedEmployees = this.employees.filter(emp => emp.selected);
  if (selectedEmployees.length === 0) return;

  this.http.post(`${environment.apiUrl}/v1/save-batch`, selectedEmployees, {headers, responseType: 'text' })
  .subscribe({
    next: (responseText) => {
      console.log("✅ Save response:", responseText);

      const payload = selectedEmployees.map(emp => ({
        id: emp.id,
        email: emp.email,
        department: emp.department,
        csrf: emp.csrf  // make sure this is populated correctly
      }));

      this.http.post(`${environment.apiUrl}/camunda/start-process`, payload, { headers })
        .subscribe(() => {
          console.log("✅ Camunda triggered");
          this.getUnsubmittedEmployees();
        });
    },
    error: (err) => {
      console.error("❌ Error saving employees:", err);
    }
  });

}

  openCamundaTasklist() {
  window.open('https://sin-1.tasklist.camunda.io/fbedbcaf-94bc-4761-9f30-70a39a25d46e/tasklist', '_blank');
}



}
