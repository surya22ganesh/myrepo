import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';

import { Devops } from '../devpos';
import { environment } from 'src/environment/enivironment';

@Component({
  selector: 'app-devops-list',
  templateUrl: './devpos-list.component.html',
  styleUrls: ['./devpos-list.component.css'],
  standalone: true,
  imports: [CommonModule]
})
export class DevopsListComponent implements OnInit {

  devops: Devops[] = [];
  selectedCrq: string | null = null;
  stages: string[] = ['Build', 'DEV', 'SIT', 'UAT', 'PROD'];
  currentStage = -1;
  assignee = '';

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.setAssigneeBasedOnRole();
    this.loadSubmittedEmployees();
  }

  setAssigneeBasedOnRole(): void {
    const roleRaw = localStorage.getItem('role') || '';
    const role = roleRaw.trim();

    switch (role) {
      case 'DBA':
        this.assignee = 'atom2demo1@gmail.com';
        break;
      case 'Server':
        this.assignee = 'commoncamundademo6@gmail.com';
        break;
      case 'Siebel':
        this.assignee = 'commoncamundademo5@gmail.com';
        break;
      default:
        console.warn('Unknown role:', roleRaw);
        this.assignee = '';
    }
  }

//   loadSubmittedEmployees(): void {
//     const token = localStorage.getItem('token'); // ✅ get JWT
//   const headers = { Authorization: `Bearer ${token}` }
//     this.http.get<Devops[]>(`${environment.apiUrl}/v1/submitted`,{ headers })
//       .subscribe(response => {
//         this.devops = response;

//         this.devops.forEach((item, index) => {
//           const payload = {
//             assignee: item.assignee,
//             processInstanceKey: item.processInstanceKey
//           };

//           this.http.post<any[]>(`${environment.apiUrl}/camunda/search`, payload,{ headers })
//             .subscribe(searchResults => {
//               const task = searchResults.find(t =>

//                 t.assignee === item.assignee
//                 ||
//                 t.name?.toLowerCase().includes(item.department.toLowerCase())
//               );
//                  this.devops[index].status = task ? this.mapTaskStateToStatus(task.taskState) : 'Assigned';
//             // No else / error fallback here anymore
//           });
//       });
//     });
// }

loadSubmittedEmployees(): void {
  const token = localStorage.getItem('token');
  const headers = { Authorization: `Bearer ${token}` };

  // this.http.get<Devops[]>(`${environment.apiUrl}/v1/submitted`, { headers })
  //   .subscribe(devopsList => {
  //     // ✅ Always reset status fresh each load
  //     this.devops = devopsList.map(item => ({ ...item, status: 'Assigned' }));

  //     this.devops.forEach((item, index) => {
  //       const payload = {
  //         assignee: item.assignee,
  //         processInstanceKey: item.processInstanceKey
  //       };

  //       this.http.post<any[]>(`${environment.apiUrl}/camunda/search`, payload, { headers })
  //         .subscribe(searchResults => {
  //           const task = searchResults.find(t =>
  //             t.assignee === item.assignee ||
  //             t.name?.toLowerCase().includes(item.department.toLowerCase())
  //           );

  //           if (item.department === 'Server') {
  //             if (!task) {
  //               this.devops[index].status = 'Assigned';  // ✅ reset on no task
  //             } else {
  //               const state = (task.taskState || '').toUpperCase();
  //               if (state === 'COMPLETED') {
  //                 this.devops[index].status = 'Completed';
  //               } else {
  //                 this.devops[index].status = 'Assigned'; // CREATED or others
  //               }
  //             }
  //           } else {
  //             this.devops[index].status = task
  //               ? this.mapTaskStateToStatus(task.taskState)
  //               : 'Assigned';
  //           }
  //         }, err => {
  //           console.error('Camunda API error for item:', item, err);
  //           this.devops[index].status = 'Assigned';
  //         });
  //     });
  //   }, err => {
  //     console.error('Failed to load submitted employees', err);
  //   });
}
mapTaskStateToStatus(taskState: string): string {
  switch ((taskState || '').toUpperCase()) {
    case 'COMPLETED':
      return 'Completed';
    case 'CREATED':
      return 'Assigned';
    case 'FAILED':
      return 'Failed';
    case 'CANCELED':
      return 'Cancelled';
    default:
      return 'Assigned';
  }
}



getStatusClass(status: string | undefined): string {
  switch ((status || '').toLowerCase()) {
    case 'completed':
      return 'bg-success text-white'; // Green
    case 'assigned':
      return 'bg-orange text-white'; // Orange
    case 'created':
      return 'bg-warning text-dark'; // Yellow
    case 'failed':
    case 'cancelled':
      return 'bg-danger text-white'; // Red
    default:
      return 'bg-secondary text-white'; // Grey fallback
  }
}


}
