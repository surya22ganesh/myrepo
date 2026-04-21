import { AfterViewInit, Component, OnDestroy, OnInit } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environment/enivironment';
import { PanelModule } from 'primeng/panel';
import { SM } from '../sm';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { TableModule } from 'primeng/table';
import { CheckboxModule } from 'primeng/checkbox';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { SelectModule } from 'primeng/select';
import { InputTextModule } from 'primeng/inputtext';
import { DatePickerModule } from 'primeng/datepicker';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { CreateCrqService } from '../create-crq/create-crq.service';

@Component({
  selector: 'app-sm-tasklist',
  templateUrl: './sm-tasklist.component.html',
  styleUrls: ['./sm-tasklist.component.css'],
  providers: [MessageService],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    HttpClientModule,
    TableModule,
    CheckboxModule,
    ButtonModule,
    DialogModule,
    SelectModule,
    InputTextModule,
    DatePickerModule,
    RouterLink,
    ToastModule,
    PanelModule,
    ProgressSpinnerModule
  ],
})
export class SMTaskListComponent implements OnDestroy, OnInit, AfterViewInit {
  // employees array (records)
  myTasklistData: SM[] = [];
  selectedEmployees: SM[] = [];
  showTasklistTable: boolean = false;
  // Comments dialog state
  commentsDialogVisible = false;
  commentsDraft = '';
  commentsEmployee?: SM;
  isChecked: boolean = true;
  teams: string[] = [];
  enableDashboard: boolean = false;
  crqReleaseNumber: string | any = "";

  // Template dropdown
  templateOptions = [
    { label: 'Component 1', value: 'Template1' },
    { label: 'Component 2', value: 'Template2' },
    { label: 'Component 3', value: 'Template3' }
  ];
  selectedTemplate: string = '';
  private intervalId: any;

  // periodic refresh helper so "Delayed" status toggles after 1 minute
  private statusRefreshTimer: any = null;
  private tick = 0; // used to trigger change detection easily
  public showStart: boolean = true;
  public depsComment: string = "";
  public dependencyDialogData: any[] = [];
  public isAllTasksCompleted: boolean = false;
  public crqNumber: string | any = '';
  public myTasklistTable: any[] = [];

  constructor(
    private router: Router,
    private http: HttpClient,
    private messageService: MessageService,
    private _crqService: CreateCrqService
  ) { }

  // New ptoast codes

  allCompleted: boolean = false;

  show() {
    this.messageService.add({ severity: 'info', summary: 'Sticky', detail: 'Message Content', sticky: true });
  }

  clear() {
    this.messageService.clear();
  }

  visible: boolean = false;

  showConfirm() {
    if (!this.visible) {
      this.messageService.add({ key: 'confirm', sticky: true, severity: 'success', summary: 'Can you send me the report?' });
      this.visible = true;
    }
  }

  onConfirm() {
    this.messageService.clear('confirm');
    this.visible = false;
  }

  onReject() {
    this.messageService.clear('confirm');
    this.visible = false;
  }

  ngAfterViewInit(): void {
    // Auto-refresh every 10 seconds
    this.intervalId = setInterval(() => {
      if (!this.isAllTasksCompleted) { // stop refreshing once all tasks completed
        this.refreshTaskList();
      } else {
        console.log('All tasks completed — auto-refresh stopped.');
        clearInterval(this.intervalId);
      }
    }, 10000); // 10000ms = 10s
  }

  ngOnInit(): void {

    this.crqNumber = localStorage.getItem('crqRef');
    this.crqReleaseNumber = localStorage.getItem('crqReleaseNum');

    this.myTasklistTable = [
      { field: 'srNo', header: 'S.No' },
      // { field: 'crqRef', header: 'CRQ Ref' },
      // { field: 'releaseNumber', header: 'Release Number' },
      { field: 'activity', header: 'Activity' },
      { field: 'impactedService', header: 'Impacted Service' },
      { field: 'plannedStartDateTime', header: 'Planned Start Date/Time' },
      { field: 'plannedEndDateTime', header: 'Planned End Date/Time' },
      { field: 'actualStartDate', header: 'Actual Start Date/Time' },
      { field: 'actualEndDate', header: 'Actual End Date/Time' },
      { field: 'teamDetails', header: 'Team details' },
      { field: 'status', header: 'Status' },
      { field: 'rag', header: 'RAG' },
      { field: 'comments', header: 'Comments' },

      // { field: 'affectedServices', header: 'Affected Services' },
      // { field: 'author', header: 'Author/Contact' },
      // { field: 'lastUpdate', header: 'Last Update' },
      // { field: 'customerImpact', header: 'Customer Impact' },
      // { field: 'serviceOutage', header: 'Service/Server Outage' },
      // { field: 'duration', header: 'Duration' },
      // { field: 'additionalNotes', header: 'Additonal Notes' },
      // { field: 'assignee', header: 'Assignee' },
      // { field: 'email', header: 'Email' },
      // { field: 'lineManager', header: 'Line Manager' },
    ];
    this.refreshTaskList();
    // this.getActiveTasks();

    // Getting CRQ Data

    // this._crqService.getTasksByCrqRef(this.crqNumber).subscribe({
    //   next: (tasks) => {
    //     console.log(tasks);
    //     this.myTasklistData = tasks;
    //   },
    //   error: (e) => {
    //     console.error(e);
    //     // window.alert("Already uploaded CRQ,Please Upload a New CRQ .")
    //   },
    //   complete: () => {
    //     console.info('complete');
    //     this.showTasklistTable = true;
    //   }
    // });

     this._crqService.getTasksByCrqRefByQuery(this.crqNumber).subscribe({
      next: (dataWithHeaders) => {
        console.log(dataWithHeaders);
        // this.crqTaskTableData = dataWithHeaders.body;
        this.myTasklistData = dataWithHeaders.body.map((item: any) => ({
          ...item,
          customerImpact: item.customerImpact ? 'Yes' : 'No',
          serviceOutage: item.serviceOutage ? 'Yes' : 'No'
        }));
      },
      error: (e) => {
        console.error(e);
        // window.alert("Already uploaded CRQ,Please Upload a New CRQ .")
      },
      complete: () => {
        console.info('complete');
        this.showTasklistTable = true;
      }
    });

  }

  refreshTaskList() {
    if (!this.crqNumber) return;

    this.showTasklistTable = false; // show spinner while loading
    this._crqService.getTasksByCrqRef(this.crqNumber).subscribe({
      next: (tasks) => {
        this.myTasklistData = tasks;

        // Optional: check if all tasks are completed
        this.isAllTasksCompleted = tasks.every((t: any) => t.status?.toLowerCase() === 'completed');
      },
      error: (e) => {
        console.error('❌ Error fetching tasks:', e);
      },
      complete: () => {
        this.showTasklistTable = true;
      }
    });
  }


  ngOnDestroy(): void {
    if (this.statusRefreshTimer) {
      clearInterval(this.statusRefreshTimer);
    }
    clearInterval(this.intervalId);
    localStorage.setItem('startClicked', 'false');
  }

  // isAnySelected(): boolean {
  //   return this.employees?.some(emp => emp.selected);
  // }

  updateEmployee(employee: SM) {
    const token = localStorage.getItem('token');
    const headers = token ? { Authorization: `Bearer ${token}` } : undefined;

    this.http.put(`${environment.apiUrl}/v1/employees/${employee.id}`, employee, { headers })
      .subscribe({
        next: () => console.log(`✅ Updated ID ${employee.id}`),
        error: (err) => console.error(`❌ Error updating ID ${employee.id}`, err)
      });
  }

  updateStatus(employee: SM, status: string) {
    employee.status = status;
    this.updateEmployee(employee); // calls backend PUT
  }

  // Comments
  openComments() {
    this.commentsDialogVisible = true;
  }
  // // Comments
  // openComments(employee: SM) {
  //   this.commentsEmployee = employee;
  //   this.commentsDraft = employee.comments || '';
  //   this.commentsDialogVisible = true;
  // }

  closeComments() {
    // this.commentsEmployee = undefined;
    // this.commentsDraft = '';
    this.commentsDialogVisible = false;
  }

  saveComments() {
    // if (!this.commentsEmployee) return;

    // const now = new Date();
    // const timestamp = now.toLocaleString();

    // const newEntry = `[${timestamp}] ${this.commentsDraft}\n------------------------\n`;

    // let existing = this.commentsEmployee.comments ? this.commentsEmployee.comments : '';
    // this.commentsEmployee.comments = `${newEntry}${existing}`;

    // this.updateEmployee(this.commentsEmployee);
    this.closeComments();
  }

  // Start flow: save -> mark actual start -> camunda -> refresh
  // sendSelectedEmployees() {
  //   if (!this.selectedTemplate) {
  //     alert("⚠️ Please select a template first.");
  //     return;
  //   }

  //   // Use currently displayed employees (filtered by template)
  //   const selected = this.employees;
  //   if (!selected || selected.length === 0) {
  //     alert("⚠️ No employees found for this template.");
  //     return;
  //   }

  //   const token = localStorage.getItem('token');
  //   const headers = token ? { Authorization: `Bearer ${token}` } : undefined;

  //   // 1) Save/Upsert batch to backend
  //   this.http.post(`${environment.apiUrl}/v1/save-batch`, selected, { headers, responseType: 'text' })
  //     .subscribe({
  //       next: () => {
  //         const idList = selected.map(e => e.id);

  //         // 2) Mark actual start (backend will set actualStartDate + status = 'In progress')
  //         this.http.post(`${environment.apiUrl}/v1/mark-start`, { ids: idList }, { headers, responseType: 'text' })
  //           .subscribe({
  //             next: () => {
  //               // Immediately reflect In progress in UI for the selected employees
  //               const nowIso = new Date().toISOString();
  //               this.employees = this.employees.map(emp => {
  //                 if (idList.includes(emp.id)) {
  //                   return { ...emp, actualStartDate: nowIso, status: 'In progress' };
  //                 }
  //                 return emp;
  //               });

  //               // 3) Trigger Camunda (do not mark Completed here!)
  //               const dbIds = selected.map(e => e.id);
  //               const csrfList = selected.map(e => e.csrf);
  //               const teamList = selected.map(e => e.department);
  //               const csrfPayload = { csrfList, team: teamList, dbIds };

  //               this.http.post(`${environment.apiUrl}/camunda/start-process`, csrfPayload, { headers, responseType: 'text' })
  //                 .subscribe({
  //                   next: () => {
  //                     alert(`🚀 CRQ Process started for ${this.selectedTemplate}`);
  //                     // ✅ Do nothing here about status.
  //                     // TaskList page will decide Completed / Failed later.
  //                   },
  //                   error: (err) => {
  //                     console.error("❌ Camunda error:", err);

  //                     // Mark all selected employees as Failed both locally and persist
  //                     const failedList = selected.map(e => ({ ...e, status: 'Failed' }));
  //                     this.http.post(`${environment.apiUrl}/v1/save-batch`, failedList, { headers })
  //                       .subscribe({
  //                         next: () => {
  //                           console.warn("⚠️ Failed status saved for employees");
  //                           // reflect in UI
  //                           const failedIds = failedList.map(f => f.id);
  //                           this.employees = this.employees.map(emp => {
  //                             if (failedIds.includes(emp.id)) {
  //                               return { ...emp, status: 'Failed' };
  //                             }
  //                             return emp;
  //                           });
  //                           alert("⚠️ Camunda failed for some employees.");
  //                           this.filterByTemplate(); // refresh
  //                         },
  //                         error: (saveErr) => console.error("❌ Error saving failed status:", saveErr)
  //                       });
  //                   }
  //                 });
  //             },
  //             error: (err) => {
  //               console.error('❌ mark-start failed', err);
  //               alert('⚠️ Could not mark start on server. Please try again.');
  //             }
  //           });
  //       },
  //       error: (err) => {
  //         console.error('❌ save-batch failed', err);
  //         alert('⚠️ Save failed.');
  //       }
  //     });
  // }


  getStatusClass(employee: any): string {
    if (!employee) return 'bg-grey text-white';
    const status = (employee.status || '').toLowerCase();

    if (status === 'failed') return 'bg-red text-white';
    if (status === 'completed') return 'bg-green text-white';
    if (status === 'not started' || !status) return 'bg-grey text-white';
    if (status === 'assigned') return 'bg-cyan-300 text-white';
    if (status === 'delayed') return 'bg-orange-400 text-white';

    if (status.includes('progress')) {
      if (employee.department?.toLowerCase() === 'siebel' && employee.actualStartDate) {
        const start = new Date(employee.actualStartDate).getTime();
        const diff = Date.now() - start;
        return diff >= 60000
          ? 'bg-amber text-white'   // Siebel → Delayed after 1 min
          : 'bg-blue text-white';   // Siebel → In Progress initially
      }
      return 'bg-blue text-white'; // Other depts → always In Progress
    }

    return 'bg-grey text-white';
  }

  getStatusText(employee: SM): string {
    if (!employee) return 'Not Started';
    const status = (employee.status || '').toLowerCase();

    if (status === 'failed') return 'Failed';
    if (status === 'completed') return 'Completed';
    if (status === 'not started' || !status) return 'Not Started';

    if (status.includes('progress')) {
      if (employee.department?.toLowerCase() === 'siebel' && employee.actualStartDate) {
        const start = new Date(employee.actualStartDate).getTime();
        const diff = Date.now() - start;
        return diff >= 60000 ? 'Delayed' : 'In Progress';
      }
      return 'In Progress'; // Other depts → always In Progress
    }

    return 'Not Started';
  }

  handleExcelUpload(event: any) {
    const file = event.target.files[0];
    if (!file) return;

    if (!file.name.endsWith('.xlsx') && !file.name.endsWith('.xls')) {
      alert('⚠️ Please upload a valid Excel file.');
      return;
    }

    // TODO: parse or send to backend
    console.log('Excel file uploaded:', file);

    // Example: send to backend
    const formData = new FormData();
    formData.append('file', file);

    const token = localStorage.getItem('token');
    const headers = token ? { Authorization: `Bearer ${token}` } : undefined;

    this.http.post(`${environment.apiUrl}/v1/upload-excel`, formData, { headers, responseType: 'text' })
      .subscribe({
        next: (res) => {
          alert('✅ Excel uploaded successfully.');
          // this.filterByTemplate(); // reload table after upload
        },
        error: (err) => {
          console.error('❌ Excel upload failed:', err);
          alert('⚠️ Excel upload failed.');
        }
      });
  }

  // getActiveTasks() {

  //   let completedArr = [];

  //   const token = localStorage.getItem('token');
  //   const headers = token ? { Authorization: `Bearer ${token}` } : undefined;

  //   this.http.get<any>(`${environment.apiUrl}/activecrq/${this.crqNumber}`, { headers }).subscribe((data: any) =>
  //    {
  //     console.log(data);
  //     this.myTasklistData = data;
  //    }
  //   );

  // }

  // public startProcessInstance() {
  //   console.log("called .");
  //   const token = localStorage.getItem('token');
  //   const headers = token ? { Authorization: `Bearer ${token}` } : undefined;

  //   // 1️⃣ Start Camunda process
  //   this.http.post(`${environment.apiUrl}/camunda/start-process`, { team: this.teams, crqNumber: this.crqNumber }, { headers, responseType: 'text' })
  //     .subscribe((res: any) => {
  //       // alert('🚀 Process started successfully.');
  //       this.showSuccess('🚀 Process started successfully');
  //       console.log('Process started response:', res);
  //       // this.http.patch('http://localhost:9090/api/v1/startHideOrShow',{headers});

  //       this.http.patch(`${environment.apiUrl}/v1/startHideOrShow`, {}, { headers, responseType: 'text' }).subscribe((data: any) => {
  //         console.log("startHideOrShow call success");
  //       }, err => {
  //         console.error("startHideOrShow call failed");
  //       }, () => {
  //         console.log("startHideOrShow completed successfully");
  //       })



  //       // // 2️⃣ After Camunda → call mark-start-submitted
  //       // this.http.post(`${environment.apiUrl}/v1/mark-start-submitted`, {}, { headers, responseType: 'text' })
  //       //   .subscribe({
  //       //     next: (res2) => {
  //       //       console.log(res2);
  //       //       alert('✅ Actual start date/time updated.');
  //       //       // this.getActiveTasks(); // reload table
  //       //     },
  //       //     error: (err2) => {
  //       //       console.error('❌ Error updating actual start:', err2);
  //       //       alert('⚠️ Could not update actual start date.');
  //       //     }
  //       //   });
  //     },
  //       (err: any) => {
  //         console.error('❌ Error starting process:', err);
  //         alert('⚠️ Error starting process.');
  //       }, () => {
  //         setTimeout(() => {
  //           this.dbaAlterActiveTasks(); // reload table
  //         }, 2000);
  //         console.log('✔️ Start process request completed');
  //       }
  //     );

  // }

  showSuccess(content: string) {
    this.messageService.add({ severity: 'success', summary: 'Success', detail: content });
  }


}
