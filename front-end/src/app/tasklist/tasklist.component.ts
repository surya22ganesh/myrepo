import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AutoCompleteModule } from 'primeng/autocomplete';
import { MessageService } from 'primeng/api';
import { DatePickerModule } from 'primeng/datepicker';
import { Router } from '@angular/router';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { TaskService } from './task.service';
import { TeamService } from '../services/msteams.service';
import { environment } from 'src/environment/environment.dev';
import { ToastModule } from 'primeng/toast';
import { PaginatorModule } from 'primeng/paginator';
import { TableModule } from 'primeng/table';
import { interval, Subscription } from 'rxjs';

@Component({
  selector: 'app-tasklist',
  templateUrl: './tasklist.component.html',
  styleUrls: ['./tasklist.component.css'],
  providers: [MessageService],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    AutoCompleteModule,
    DatePickerModule,
    ToastModule,
    PaginatorModule,
    TableModule
  ]
})
export class TaskListComponent implements OnInit, OnDestroy {

  tasks: any[] = [];
  selectedTask: any = null;

  selectedStatus: any = '';
  statuses: any[] = [
    { label: 'Completed', value: 'Completed' },
    { label: 'Failed', value: 'Failed' }
    // { label: 'Delayed', value: 'Delayed' }
  ];

  filteredStatuses: any[] = [];

  refreshSubscription!: Subscription;
  refreshTime = 10000;

  assignee: string = '';
  executeDeployment: string = 'yes';
  popupOpen = false;

  taskId: number = 0;

  crqTicket: string = '';
  processInstanceId: string = '';

  isLoading = false;
  comments: string = '';

  parsedTask: any;

  responses: any[] = [];

  userRoles: string[] = [];

  date1: Date | undefined;

  constructor(
    private router: Router,
    private taskService: TaskService,
    private http: HttpClient,
    private messageService: MessageService,
    private teamService: TeamService
  ) { }

  ngOnInit(): void {

    this.loadUserRoles();

    const userEmail = localStorage.getItem('userEmail');
    if (userEmail) {
      this.assignee = userEmail;
    }

    this.loadTasks();

    this.refreshSubscription = interval(this.refreshTime).subscribe(() => {
      if (!this.popupOpen && !this.isLoading) {
        this.loadTasks();
      }
    });
  }


  ngOnDestroy(): void {

    if (this.refreshSubscription) {
      this.refreshSubscription.unsubscribe();
    }
  }

  loadUserRoles() {

    const roles = localStorage.getItem('roles');

    if (roles) {
      this.userRoles = JSON.parse(roles);
    }

    // remove Deployment Manager
    this.userRoles = this.userRoles.filter(
      r => r.toLowerCase() !== 'deployment manager'
    );

    console.log("User Roles:", this.userRoles);
  }

  loadTasks() {

    this.taskService.getTasksFromDB(this.userRoles).subscribe({

      next: (res: any[]) => {

        this.tasks = res
          .filter(task => {
            const team = task.teamDetails?.toLowerCase();

            return this.userRoles.some(
              role => role.toLowerCase() === team
            );
          })
          .map((task: any) => ({
            id: task.taskId,
            camundaTaskId: task.camundaTaskId,
            variables: {
              taskId: task.taskId,
              crqRef: task.crqRef,
              activity: task.activity,
              plannedStartDateTime: task.plannedStartDateTime,
              plannedEndDateTime: task.plannedEndDateTime,
              duration: task.duration,
              teamDetails: task.teamDetails,
              status: task.status || 'Assigned',
              comments: task.comments
            }
          }));

      },

      error: err => console.error('Error loading tasks:', err)

    });
  }
  // loadTasks() {

  //   this.taskService.getTasksByRoles(this.userRoles).subscribe({

  //     next: (res: any[]) => {

  //       this.tasks = res
  //         .filter(task => task.isStarted === true) // ✅ safety
  //         .map((task: any) => {

  //           return {
  //             id: task.taskId,
  //             variables: {
  //               taskId: task.taskId,
  //               crqRef: task.crqMain?.crqRef,
  //               activity: task.activity,
  //               plannedStartDateTime: task.plannedStartDateTime,
  //               plannedEndDateTime: task.plannedEndDateTime,
  //               duration: task.duration,
  //               teamDetails: task.teamDetails,
  //               status: task.status || 'Assigned',
  //               comments: task.comments
  //             }
  //           };

  //         });

  //     },

  //     error: err => {
  //       console.error('Error loading tasks:', err);
  //     }

  //   });
  // }



  loadTaskVariables(taskId: string) {

    this.taskService.fetchTaskVariables(taskId).subscribe({

      next: (res) => {

        const taskVar = res.find(v => v.name === 'task');

        if (!taskVar) {
          return;
        }

        const parsedTask = JSON.parse(taskVar.value);

        this.parsedTask = parsedTask;

        this.saveInProgress(parsedTask);
      },

      error: (err) => console.error(err)
    });
  }

  saveInProgress(parsedTask: any) {

    const payload = {
      status: 'In Progress',
      comments: '',
      taskId: parsedTask.taskId
    };

    //     this.taskService.saveStatus(payload).subscribe({
    //       next: () => console.log('Status saved'),
    //       error: err => console.error(err)
    //     });

    this.taskService.saveStatus(payload).subscribe({
      next: (data) => {
        console.log('Status saved');

        //In progress message sent
        // this.taskService.smtpSendMail(data).subscribe({
          this.taskService.notifyBackend(payload).subscribe({
          next: (v) => console.log(v),
          error: (e) => console.error(e),
          complete: () => console.info('complete')
        });

      },
      error: err => console.error(err),
      complete: () => {
        // call smtp for In Progress teams notification

        parsedTask.status = "In Progress";


      }
    });

  }

  sendTeam(parsedTask: any) {

    const teamPayload = {
      activity: parsedTask.activity,
      crqRefNumber: parsedTask.crqRef,
      teamDetails: parsedTask.teamDetails
    };

    // this.teamService.sendTeamDetails(teamPayload).subscribe({
    //   next: () => { },
    //   error: () => { }
    // });
  }

  assign(taskId: string) {

    this.taskService.assignTask(taskId, this.assignee)
      .subscribe(() => this.loadTasks());
  }

  unassign(taskId: string) {

    this.taskService.unassignTask(taskId)
      .subscribe(() => this.loadTasks());
  }

  openPopup(task: any) {

    this.selectedTask = task;
    this.popupOpen = true;

    // this.loadTaskVariables(task.id);

    // this.crqTicket = task.crqTicket;
    // this.processInstanceId = task.processInstanceId;

    // task.status = 'In Progress';

    this.parsedTask = task.variables;

    // ✅ GET logged-in user
    const userEmail = localStorage.getItem('userEmail');

    if (userEmail && task.camundaTaskId) {

      // ✅ CALL ASSIGN API
      this.taskService.assignTask(task.camundaTaskId, userEmail)
        .subscribe({
          next: () => {
            console.log('Task assigned to:', userEmail);
          },
          error: (err) => {
            console.error('Assign failed:', err);
          }
        });
    }

    this.sendTeam(task.variables);

    this.comments = task.comments || '';

    const payload = {
      status: 'In Progress',
      comments: '',
      taskId: this.parsedTask.taskId
    };

    this.taskService.saveStatus(payload).subscribe({
      next: (data) => {
        console.log('Task marked as In Progress');
        //failed msg
        // this.taskService.smtpSendMail(data).subscribe({
        //   next: (v) => console.log(v),
        //   error: (e) => console.error(e),
        //   complete: () => console.info('complete')
        // });
        this.taskService.notifyBackend(payload).subscribe({
          next: (v) => console.log(v),
          error: (e) => console.error(e)
        });

      },

      error: err => console.error(err)
    });
  }

  closePopup() {

    this.popupOpen = false;
    this.selectedTask = null;
    this.executeDeployment = 'yes';
    this.comments = '';

    this.loadTasks();
  }

  getStatusValue(): string {

    if (!this.selectedStatus) return '';

    if (typeof this.selectedStatus === 'object') {
      return this.selectedStatus.label;
    }

    return this.selectedStatus;
  }

  onStatusChange() {

    const s = this.getStatusValue();
    console.log('STATUS CHANGED =>', s);

    if (s === 'Failed' || s === 'Delayed') {
      this.executeDeployment = 'no';
    }

    if (s === 'Completed') {
      this.executeDeployment = 'yes';
      this.comments = '';
    }
    // const status = this.getStatusValue();
    // if (status === 'Failed') {
    //   this.responses = ['Please provide failure reason'];
    // } else {
    //   this.responses = [];
    // }
  }

  isCommentRequired(): boolean {

    const status = this.getStatusValue();

    return status === 'Failed' || status === 'Delayed';
  }

  isCommentsInvalid(): boolean {

    if (!this.isCommentRequired()) {
      return false;
    }

    return !this.comments || this.comments.trim().length === 0;
  }

  completeTask(form: any) {

    if (!this.selectedTask) return;

    const statusValue = this.getStatusValue();

    if (!statusValue) {
      form.control.markAllAsTouched();
      return;
    }

    if (this.isCommentsInvalid()) {

      this.messageService.add({
        severity: 'warn',
        summary: 'Comments Required',
        detail: 'Comments are mandatory for Failed or Delayed status'
      });

      return;
    }

    this.isLoading = true;

    const payload = {
      status: statusValue,
      comments: this.comments,
      taskId: this.parsedTask?.taskId
    };


    this.taskService.completeTask(this.selectedTask.camundaTaskId, this.executeDeployment)
      .subscribe({

        next: () => {

          this.taskService.saveRagStatusComments(payload)
            .subscribe({

              next: (data) => {
                //complete
                // this.taskService.smtpSendMail(data).subscribe({
                this.taskService.notifyBackend(payload).subscribe({
                  next: (v) => console.log(v),
                  error: (e) => console.error(e),
                  complete: () => console.info('complete')
                });

                this.messageService.add({
                  severity: 'success',
                  summary: 'Task Completed'
                });

                this.isLoading = false;
                this.popupOpen = false;
                this.selectedTask = null;

                this.loadTasks();
              },

              error: () => {
                this.isLoading = false;
              }
            });

        },

        error: () => {
          this.isLoading = false;
        }

      });
  }

  filterStatuses(event: any) {

    const query = event.query.toLowerCase();

    this.filteredStatuses = this.statuses.filter(s =>
      s.label.toLowerCase().includes(query)
    );
  }

  loadRagStatus(parsedTask: any) {

    const token = localStorage.getItem('token');

    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`
    });

    this.http
      .get<any[]>(`${environment.urls.crqService}/rag-status/by-crq/${parsedTask.taskId}`, { headers })
      .subscribe({

        next: (response) => {

          if (!Array.isArray(response) || response.length === 0) {
            parsedTask.status = 'Assigned';
            return;
          }

          const ragData = response[0];

          parsedTask.status = ragData.status || 'Assigned';
          parsedTask.comments = ragData.comments;
        },

        error: () => {
          parsedTask.status = 'Assigned';
        }
      });
  }

}
