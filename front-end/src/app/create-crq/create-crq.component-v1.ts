// import { Component, OnInit, ViewChild, HostListener } from '@angular/core';
// import { DividerModule } from 'primeng/divider';
// import { FileUploadEvent, FileUploadHandlerEvent, FileUploadModule, UploadEvent, FileUpload } from 'primeng/fileupload';
// import { AutoCompleteModule } from 'primeng/autocomplete';
// import { FormsModule } from '@angular/forms';
// import { CommonModule } from '@angular/common';
// import { CreateCrqService } from './create-crq.service';
// import { SM } from '../sm';
// import { CheckboxModule } from 'primeng/checkbox';
// import { ToastModule } from 'primeng/toast';
// import { MessageService } from 'primeng/api';
// import { NavigationEnd, Router, RouterLink, RouterModule, RouterOutlet } from '@angular/router';
// import { Dialog, DialogModule } from 'primeng/dialog';
// import { ButtonModule } from 'primeng/button';
// import { InputTextModule } from 'primeng/inputtext';
// import { TableModule } from "primeng/table";
// import { AiServiceService } from '../services/ai-service.service'
// import { HttpClient } from '@angular/common/http';
// import { HttpClientModule } from '@angular/common/http';
// import { environment } from 'src/environment/enivironment';

// interface Column {
//     field: string;
//     header: string;
// }

// @Component({
//     selector: 'app-create-crq',
//     imports: [RouterLink, CommonModule, RouterModule, ButtonModule, DialogModule, Dialog, TableModule, ToastModule, CheckboxModule, TableModule, CommonModule, FormsModule, DividerModule, ButtonModule, FileUploadModule, AutoCompleteModule, HttpClientModule],
//     standalone: true,
//     templateUrl: './create-crq.component.html',
//     styleUrl: './create-crq.component.css',
//     providers: [MessageService]
// })
// export class CreateCrqComponent implements OnInit {

//     crqNumber: string = "";

//     username: string = 'User';

//     selectedComponent: string = '';

//     items: string[] = ['Component 1', 'Component 2', 'Component 3'];

//     showCRQForm: boolean = false;

//     showUploadedCrqTable: boolean = false;

//     @ViewChild('fileUploader') fileUploader!: FileUpload;

//     // isTaskAdded: boolean = true;

//     componentTasks: any[] | any = [];
//     uploadedCrqcols: any[] = [];
//     uploadedCrqValue: any[] = [];
//     crqReleaseNumber: string = "";


//     // selectedTasks: SM[] = [];
//     selectedTasks: Map<string, SM[]> = new Map();
//     isLoading: boolean = false;


//     @HostListener('window:beforeunload', ['$event'])
//     onBrowserClose(event: BeforeUnloadEvent): void {
//         this.cleanup();
//     }

//     cleanup() {
//         console.log('Browser/tab is closing');
//         window.alert("browser is closing");
        
//         // logout logic
//         // localStorage cleanup
//         // stop timers
//     }

//     constructor(private _crqService: CreateCrqService, private _router: Router, private messageService: MessageService, private _aiService: AiServiceService, private http: HttpClient,) { };

//     ngOnInit(): void {
//         const storedUser = localStorage.getItem('userName');
//         if (storedUser) {
//             this.username = storedUser;
//         }

//         this.cols = [
//             { field: 'step', header: 'Step' },
//             { field: 'prone_to_issues', header: 'Prone To Issues' },
//             { field: 'severity', header: 'Severity' },
//             { field: 'resolution', header: 'Resolution' },
//             { field: 'root_cause', header: 'Root Cause' }
//         ];

//         this.uploadedCrqcols = [
//             { field: 'srNo', header: 'S.No' },
//             { field: 'crqRef', header: 'CRQ Ref' },
//             { field: 'releaseNumber', header: 'Release Number' },
//             { field: 'affectedServices', header: 'Affected Services' },
//             { field: 'author', header: 'Author/Contact' },
//             { field: 'lastUpdate', header: 'Last Update' },
//             { field: 'customerImpact', header: 'Customer Impact' },
//             { field: 'serviceOutage', header: 'Service/Server Outage' },
//             { field: 'activity', header: 'Activity' },
//             { field: 'impactedService', header: 'Impacted Service' },
//             { field: 'plannedStartDateTime', header: 'Planned Start Date/Time' },
//             { field: 'plannedEndDateTime', header: 'Planned End Date/Time' },
//             { field: 'duration', header: 'Duration' },
//             { field: 'teamDetails', header: 'Team details' },
//             { field: 'additionalNotes', header: 'Additonal Notes' },
//             { field: 'assignee', header: 'Assignee' },
//             { field: 'email', header: 'Email' },
//             { field: 'lineManager', header: 'Line Manager' },
//         ]

//         // this.predictResp = [
//         //     {
//         //         "step": "Server Team to do the system health check for all the servers",
//         //         "prone_to_issues": true,
//         //         "severity": "Medium",
//         //         "resolution": "Rerunning the script after correcting permissions.",
//         //         "root_cause": "Incorrect file permissions on the health check script."
//         //     },
//         //     {
//         //         "step": "Put flashback mode ON DRCMIRRPRCRM, DRCSCRMEXA, DRCPCRMHA, DRCMIRRPRBRM, PROSM2EXA",
//         //         "prone_to_issues": true,
//         //         "severity": "Medium",
//         //         "resolution": "Manual intervention by DBA to enable flashback.",
//         //         "root_cause": "Database configuration drift; flashback was disabled at the parameter level."
//         //     }
//         // ];

//     }

//     startProcessInstance() {

//         console.log("StartProcessInstance called .");
//         const token = localStorage.getItem('token');
//         const headers = token ? { Authorization: `Bearer ${token}` } : undefined;

//         // starting a process instance.

//         this._crqService.startProcessInstance(this.crqNumber).subscribe({
//             next: (v) => console.log(v),
//             error: (e) => console.error(e),
//             complete: () => {
//                 console.info('process Instance created');

//                 // setting isStarted boolean from false to true
//                 let crqTasksList = this.markIsStartedToTrue(this.crqNumber);
//                 console.log("crq tasks list : " + crqTasksList);

//                 this._router.navigate(['/sm-tasklist']);


//             }
//         })




//     }

//     // createCRQFun() {
//     //   // this.showCRQForm = !this.showCRQForm;
//     //   console.log("Print here");
//     //   console.log("called .");
//     //   const token = localStorage.getItem('token');
//     //   const headers = token ? { Authorization: `Bearer ${token}` } : undefined;

//     //   // 1️⃣ Start Camunda process
//     //   this.http.post(`${environment.apiUrl}/camunda/start/${this.crqNumber}`, { headers, responseType: 'text' })
//     //     .subscribe((res: any) => {
//     //       // alert('🚀 Process started successfully.');
//     //       // this.showSuccess('🚀 Process started successfully');
//     //       console.log('Process started response:', res);
//     //       // this.http.patch('http://localhost:9090/api/v1/startHideOrShow',{headers});

//     //     },
//     //       (err: any) => {
//     //         console.error('❌ Error starting process:', err);
//     //         alert('⚠️ Error starting process.');
//     //       }, () => {
//     //         // inserting table into ActiveCrqs table .
//     //         this.http.get(`${environment.apiUrl}/activecrq`, { headers, responseType: 'text' }).subscribe(data => console.log(data)
//     //           , err => console.log(err)
//     //           , () => {
//     //             localStorage.setItem('crqNumber', this.crqNumber);
//     //             localStorage.setItem('crqReleaseNumber', this.crqReleaseNumber);
//     //             this._router.navigate(['/sm-tasklist']);
//     //           }
//     //         );
//     //       }
//     //     );


//     //   // this.selectedComponent = '';
//     // }

//     async onUpload(event: FileUploadHandlerEvent) {

//         let crqNumber: any;

//         this.fileUploader.clear();

//         console.log("upload called");
//         console.log(event.files[0]);

//         const uploadedFile: File = event.files[0];

//         this._crqService.readCrqRef(uploadedFile).subscribe({
//             next: (data) => {
//                 console.log(data);
//                 crqNumber = data;
//             },
//             error: (e) => console.error(e),
//             complete: () => {
//                 console.info('ReadCrqRef complete');
//                 this.crqNumber = crqNumber;

//                 this._crqService.checkAlreadyUploadedCrq(crqNumber).subscribe({
//                     next: (isAlreadyPresent) => {
//                         console.log(isAlreadyPresent);

//                         if (!isAlreadyPresent) {
//                             console.log("entered IF BLOCK");
//                             // call uploadfile api

//                             this._crqService.uploadFile(uploadedFile).subscribe({
//                                 next: (data) => {
//                                     console.log(data);
//                                     crqNumber = data;
//                                 },
//                                 error: (e) => console.error(e),
//                                 complete: () => {
//                                     console.info('file upload complete');
//                                     this.crqNumber = crqNumber;
//                                     // setting boolean showUploadedCrqTable =  true.
//                                     this.showUploadedCrqTable = true;
//                                     console.log("CRQ NUMBER : " + this.crqNumber);

//                                     // LOCALSTORAGE
//                                     localStorage.setItem('crqRef', crqNumber);

//                                     // Getting CRQ Data
//                                     this._crqService.getTasksByCrqRef(this.crqNumber).subscribe({
//                                         next: (tasks) => {
//                                             console.log(tasks);
//                                             this.uploadedCrqValue = tasks;
//                                         },
//                                         error: (e) => {
//                                             console.error(e);
//                                             window.alert("Already uploaded CRQ,Please Upload a New CRQ .")
//                                         },
//                                         complete: () => console.info('complete')
//                                     });

//                                 }
//                             })

//                         } else {
//                             window.alert("CRQ already present");
//                             console.log("else block entered");

//                         }
//                     },
//                     error: (e) => {
//                         console.error(e);
//                         window.alert("CRQ already present")
//                     },
//                     complete: () => console.info('checkAlreadyUploadedCrq complete')
//                 })
//             }
//         })


//         // OLD CODES
//         // this._crqService.uploadFile(uploadedFile).subscribe((data: any) => {
//         //   console.log(data);
//         //   this.crqNumber = data;

//         // }
//         //   , err => console.log(err)
//         //   , () => {
//         //     // setting boolean showUploadedCrqTable =  true.
//         //     this.showUploadedCrqTable = true;
//         //     console.log("CRQ NUMBER : " + this.crqNumber);

//         //     this._crqService.getCrqData(this.crqNumber).subscribe((data: any) => {
//         //       // setting header value
//         //       // this.uploadedCrqcols = Object.keys(data[0]);
//         //       this.uploadedCrqValue = data;
//         //       // this.crqNumber = data[0].crqRef;
//         //       this.crqReleaseNumber = data[0].releaseNumber;
//         //       console.log(this.crqNumber)
//         //       console.log(data)
//         //     },
//         //       err => console.log(err),
//         //       () => {
//         //         localStorage.setItem('crqRef', this.crqNumber);
//         //         //             localStorage.setItem('crqReleaseNumber', this.crqReleaseNumber);
//         //       }
//         //     )

//         //   })  

//         // this._crqService.uploadFile(uploadedFile).subscribe({
//         //   next: (data) => {
//         //     console.log(data);
//         //     crqNumber = data;
//         //   },
//         //   error: (e) => console.error(e),
//         //   complete: () => {
//         //     console.info('complete');
//         //     this.crqNumber = crqNumber;
//         //     // setting boolean showUploadedCrqTable =  true.
//         //     this.showUploadedCrqTable = true;
//         //     console.log("CRQ NUMBER : " + this.crqNumber);

//         //     // Getting CRQ Data
//         //     this._crqService.getTasksByCrqRef(this.crqNumber).subscribe({
//         //       next: (data) => console.log(data),
//         //       error: (e) => {
//         //         console.error(e);
//         //         window.alert("Already uploaded CRQ,Please Upload a New CRQ .")
//         //       },
//         //       complete: () => console.info('complete')
//         //     })
//         //   }
//         // })



//         // OLD CODES
//         // this._crqService.uploadFile(uploadedFile).subscribe((data: any) => {
//         //   console.log(data);
//         //   this.crqNumber = data;

//         // }
//         //   , err => console.log(err)
//         //   , () => {
//         //     // setting boolean showUploadedCrqTable =  true.
//         //     this.showUploadedCrqTable = true;
//         //     console.log("CRQ NUMBER : " + this.crqNumber);

//         //     this._crqService.getCrqData(this.crqNumber).subscribe((data: any) => {
//         //       // setting header value
//         //       // this.uploadedCrqcols = Object.keys(data[0]);
//         //       this.uploadedCrqValue = data;
//         //       // this.crqNumber = data[0].crqRef;
//         //       this.crqReleaseNumber = data[0].releaseNumber;
//         //       console.log(this.crqNumber)
//         //       console.log(data)
//         //     },
//         //       err => console.log(err),
//         //       () => {
//         //         localStorage.setItem('crqRef', this.crqNumber);
//         //         //             localStorage.setItem('crqReleaseNumber', this.crqReleaseNumber);
//         //       }
//         //     )

//         //   })

//     }

//     markIsStartedToTrue(crqRef: String | null): any {

//         console.log("markIsStartedToTrue called .");
//         const token = localStorage.getItem('token');
//         const headers = token ? { Authorization: `Bearer ${token}` } : undefined;

//         this._crqService.markIsStartedToTrue(crqRef).subscribe((data: any) => {
//             console.log(data);
//             console.log("updating uploadedCrqValue ");
//             // this.uploadedCrqValue = data;
//             return data;
//         }, err => {
//             console.log("markIsStartedToTrue error")
//         }, () => {
//             console.log("markIsStartedToTrue successful");
//         })

//     }

//     search(event: any) {
//         // Simulate a search operation
//         this.items = ['Application 1', 'Application 2', 'Application 3'].filter(item => item.toLowerCase().includes(event.query.toLowerCase()));
//         console.log("search called" + this.selectedComponent);
//     }

//     select(event: any) {

//         const selectedComp = event.toString().toLowerCase().replace(/\s+/g, '');
//         console.log("selected comp" + selectedComp);

//         let template = '';
//         switch (selectedComp) {
//             case 'application1': template = 'Template1'; break;
//             case 'application2': template = 'Template2'; break;
//             case 'application3': template = 'Template3'; break;
//             default: template = 'Template1';
//         }

//     }


//     // addTasks(event: any) {
//     //   console.log("event : " + event);
//     //   // this.selectedTasks = this.componentTasks.filter((task: SM) => task.submitted);
//     //   this.selectedTasks.push(...this.componentTasks.filter((task: SM) => task.submitted && !this.selectedTasks.includes(task)));
//     //   console.log("selectedTasks : " + this.selectedTasks);
//     // }

//     toggleTaskSelection(task: SM, checked: boolean) {
//         const template = this.selectedComponent.toLowerCase().replace(/\s+/g, '') === 'component1'
//             ? 'Template1' : this.selectedComponent.toLowerCase().replace(/\s+/g, '') === 'component2'
//                 ? 'Template2' : 'Template3';

//         if (!this.selectedTasks.has(template)) {
//             this.selectedTasks.set(template, []);
//         }

//         let tasks = this.selectedTasks.get(template)!;

//         if (checked) {
//             if (!tasks.some(t => t.id === task.id)) {
//                 tasks.push(task);
//             }
//         } else {
//             this.selectedTasks.set(template, tasks.filter(t => t.id !== task.id));
//         }
//     }

//     sendTasks() {
//         const allSelected: SM[] = Array.from(this.selectedTasks.values()).flat();
//         if (allSelected.length === 0) {
//             alert("⚠️ Please select at least one task before sending.");
//             return;
//         }

//         this.isLoading = true;
//         // Generate CRQ ticket
//         const timestamp = Date.now() % 10000000;
//         const crqTicket = "CRQ" + timestamp;



//         // Map DeploymentDetails → SelectedTask DTO
//         const tasks = allSelected.map(task => ({
//             activity: task.activity,
//             impactedService: task.impactedService,
//             plannedStartDate: task.plannedStartDate,
//             plannedEndDate: task.plannedEndDate,
//             department: task.department,
//             template: task.template,
//             submitted: true,
//             // crqTicket: crqTicket
//         }));

//         console.log(tasks);

//         const payload = {
//             crqTicket: this.crqNumber,
//             tasks: tasks
//         };

//         // calling AI Predict

//         let activities = tasks.map(task => task.activity);

//         this._aiService.predict(activities).subscribe((data: any) => {
//             let resp = JSON.parse(data);
//             this.predictResp = resp.insights;
//         }, err => console.error("error ai resp")
//             , () => {
//                 this.showAiBell = true;
//                 this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Click 🔔 to view notifications' });
//                 this.isLoading = false;
//             }
//         )

//         console.log(this.selectedTasks);

//         this._crqService.saveSelectedTasks(payload).subscribe({
//             next: () => {
//                 // this.messageService.add({ severity: 'success', summary: 'Success', detail: '' });
//                 // alert(`✅ Tasks submitted successfully! `);
//                 // below not working
//                 this.selectedTasks.clear();
//                 // Navigate to tasklist and pass CRQ ticket
//                 setTimeout(() => {
//                     // changed
//                     // this._router.navigate(['/sm-tasklist']);
//                 }, 1000);
//             },
//             error: (err) => {
//                 console.error(err);
//                 this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Message Content' });
//                 // alert("❌ Failed to save tasks");
//             }
//         });


//     }

//     // sendTasksFun() {
//     //   console.log("Send Tasks Clicked");
//     //   console.log("Tasks to be sent : " + this.selectedTasks);

//     //   // Navigate to the task list component with selected tasks as state.
//     //   this._router.navigate(['/sm-tasklist']);
//     // }

//     setDependencies() {
//         console.log("Set Dependencies Clicked");
//         // Navigate to the task list component with selected tasks as state.
//         this._router.navigate(['/set-dependencies']);
//     }

//     // AI Response dialog codes


//     // predictResp!: Product[];

//     showAiBell: boolean = false;

//     predictResp!: any;

//     cols!: Column[];

//     visible: boolean = false;

//     position: 'left' | 'right' | 'top' | 'bottom' | 'center' | 'topleft' | 'topright' | 'bottomleft' | 'bottomright' = 'center';

//     showAIresponse(position: 'left' | 'right' | 'top' | 'bottom' | 'center' | 'topleft' | 'topright' | 'bottomleft' | 'bottomright') {
//         this.position = position;
//         this.visible = true;
//     }

// }
