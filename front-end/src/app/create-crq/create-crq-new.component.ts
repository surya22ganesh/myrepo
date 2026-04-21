import { Component, OnInit, ViewChild } from '@angular/core';
import { DividerModule } from 'primeng/divider';
import { FileUploadHandlerEvent, FileUploadModule, FileUpload } from 'primeng/fileupload';
import { AutoCompleteModule } from 'primeng/autocomplete';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { CreateCrqService } from './create-crq-new.service';
import { SM } from '../sm';
import { CheckboxModule } from 'primeng/checkbox';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { Router, RouterModule } from '@angular/router';
import { DialogModule } from 'primeng/dialog';
import { ButtonModule } from 'primeng/button';
import { TableModule } from "primeng/table";
import { AiServiceService } from '../services/ai-service.service'
import { HttpClient } from '@angular/common/http';
import { HttpClientModule } from '@angular/common/http';
import { catchError, switchMap, throwError, finalize } from 'rxjs';

interface Column {
  field: string;
  header: string;
}

enum severity {
  success = "success",
  error = "error"
}

@Component({
  selector: 'app-create-crq',
  imports: [CommonModule, RouterModule, ButtonModule, DialogModule, TableModule, ToastModule, CheckboxModule, TableModule, CommonModule, FormsModule, DividerModule, ButtonModule, FileUploadModule, AutoCompleteModule, HttpClientModule],
  standalone: true,
  templateUrl: './create-crq.component.html',
  styleUrl: './create-crq.component.css',
  providers: [MessageService]
})
export class CreateCrqComponent implements OnInit {

  crqNumber: string = "";

  activeCrqid: string = "";

  username: string = 'User';

  selectedComponent: string = '';

  items: string[] = ['Component 1', 'Component 2', 'Component 3'];

  showCRQForm: boolean = false;

  showUploadedCrqTable: boolean = false;

  @ViewChild('fileUploader') fileUploader!: FileUpload;

  // isTaskAdded: boolean = true;

  componentTasks: any[] | any = [];
  uploadedCrqMaincols: any[] = [];
  uploadedCrqcols: any[] = [];
  uploadedCrqValue: any[] = [];
  uploadedCrqMainValue: any[] = [];
  crqReleaseNumber: string = "";

  selectedTasks: Map<string, SM[]> = new Map();
  isLoading: boolean = false;
  crqData: any;

  disableStartBtn: boolean = false;
  rotaFileUploaded: boolean = false;

  rotaPreviewData: any[] = [];
  showRotaPreview: boolean = false;
  selectedRotaFile!: File;

  constructor(private _crqService: CreateCrqService, private _router: Router, private messageService: MessageService, private _aiService: AiServiceService, private http: HttpClient) { };

  openCrqForm() {
    this._router.navigate(['/crq-form']);
  }
  ngOnInit(): void {

    const storedUser = localStorage.getItem('userName');
    if (storedUser) {
      this.username = storedUser;
    }

    this.cols = [
      { field: 'step', header: 'Step' },
      { field: 'prone_to_issues', header: 'Prone To Issues' },
      { field: 'severity', header: 'Severity' },
      { field: 'resolution', header: 'Resolution' },
      { field: 'root_cause', header: 'Root Cause' }
    ];

    this.uploadedCrqcols = [
      { field: 'srNo', header: 'S.No' },
      // { field: 'crqRef', header: 'CRQ Ref' },
      // { field: 'releaseNumber', header: 'Release Number' },
      // { field: 'affectedServices', header: 'Affected Services' },
      // { field: 'author', header: 'Author/Contact' },
      // { field: 'lastUpdate', header: 'Last Update' },
      { field: 'customerImpact', header: 'Customer Impact' },
      { field: 'serviceOutage', header: 'Service/Server Outage' },
      { field: 'activity', header: 'Activity' },
      { field: 'impactedService', header: 'Impacted Service' },
      { field: 'plannedStartDateTime', header: 'Planned Start Date/Time' },
      { field: 'duration', header: 'Duration' },
      { field: 'plannedEndDateTime', header: 'Planned End Date/Time' },
      { field: 'teamDetails', header: 'Team details' },
      { field: 'additionalNotes', header: 'Additonal Notes' },
      // { field: 'assignee', header: 'Assignee' },
      // { field: 'email', header: 'Email' },
      // { field: 'lineManager', header: 'Line Manager' },
    ]

    this.uploadedCrqMaincols = [
      { field: "crqRef", header: "CRQ" },
      { field: "summary", header: "Summary" },
      { field: "affectedServices", header: "Affected Services" },
      { field: "author_contact", header: "Author/Contact" },
      // { field: "createdDateTime", header: "Created Date Time" },
      { field: "lastUpdatedDateTime", header: "Last Updated Date" },
    ];

  }


  // startProcessInstance() {

  //   console.log("StartProcessInstance called.");

  //   this._crqService.checkAlreadyUploadedCrq(this.crqNumber).pipe(

  //     // 👉 Start Camunda
  //     switchMap(() => this._crqService.startProcessInstance(this.crqNumber)),

  //     // 👉 Save CRQ
  //     switchMap(() => this._crqService.saveCrqData(this.crqData)),

  //     // 👉 Assign ALL tasks
  //     switchMap((v: any) => {

  //       console.log("saveCrqData response:", v);

  //       // ✅ collect all taskIds
  //       const taskIds: number[] = v.crqTasksList.map((x: any) =>
  //         Number(x.taskId || x.id)
  //       );

  //       if (!taskIds || taskIds.length === 0) {
  //         console.error("No taskIds found", v);
  //         return throwError(() => new Error("TaskIds not found"));
  //       }

  //       // store common values
  //       localStorage.setItem('crqRef', v.crqMainList[0].crqRef);
  //       localStorage.setItem('crqReleaseNum', v.crqMainList[0].summary);

  //       // ✅ create assign calls
  //       return this._crqService.assignTasks(taskIds);
  //     })

  //   ).subscribe({
  //     next: (res) => {
  //       console.log("All tasks assigned successfully", res);
  //     },
  //     error: (e) => {
  //       console.error(e);
  //       this.showError("Error occurred while starting CRQ");
  //     },
  //     complete: () => {
  //       this.showInfo("CRQ Started");
  //       this._router.navigate(["/sm-tasklist"]);
  //     }
  //   });
  // }

  // startProcessInstance() {
  //   this.disableStartBtn = true;
  //   console.log("StartProcessInstance called .");
  //   const token = localStorage.getItem('token');
  //   const headers = token ? { Authorization: `Bearer ${token}` } : undefined;

  //   // CHECK ALREADY UPLOADED CRQ

  //   this._crqService.checkAlreadyUploadedCrq(this.crqNumber).subscribe({
  //     next: (isAlreadyPresent) => {
  //       console.log(isAlreadyPresent);

  //       // start camunda here.

  //       this._crqService.startProcessInstance(this.crqNumber).subscribe({
  //         next: (v) => {
  //           console.log("camunda process instance started " + v);
  //         },
  //         error: (e) => {
  //           console.error(e);
  //           console.error(e.error);
  //           // this.showError("Cluster down or flow may not be deployed. Check camunda.");
  //           this.showMessage(severity.error, e.error);
  //           this.disableStartBtn = false;
  //         },
  //         complete: () => {
  //           console.info('complete');

  //           // this.showInfo("CRQ Started");

  //           this.showMessage(severity.success, "CRQ Started");

  //           // Saving into DB.

  //           let saveCrqDataResp: any;

  //           this._crqService.saveCrqData(this.crqData).subscribe({
  //             next: (v) => {
  //               console.log(v);
  //               saveCrqDataResp = v;
  //               localStorage.setItem('crqRef', v.crqMainList[0].crqRef);
  //               localStorage.setItem('crqReleaseNum', v.crqMainList[0].summary);
  //             },
  //             error: (e) => console.error(e),
  //             complete: () => {

  //               // localStorage.setItem('releaseNumber', this.crqNumber);

  //               console.info('complete');
  //               console.log("saveCrqData called successfully.");
  //               this._router.navigate(["/sm-tasklist"]);


  //               // assignee codes

  //               // // ✅ collect all taskIds
  //               // const taskIds: number[] = saveCrqDataResp.crqTasksList.map((x: any) =>
  //               //   Number(x.taskId || x.id)
  //               // );

  //               // if (!taskIds || taskIds.length === 0) {
  //               //   console.error("No taskIds found", saveCrqDataResp);
  //               //   throwError(() => new Error("TaskIds not found"));
  //               // }

  //               // this._crqService.assignTasks(taskIds).subscribe({
  //               //   next: (v) => console.log(v),
  //               //   error: (e) => console.error(e),
  //               //   complete: () => {
  //               //     console.info('tasks assignee complete');
  //               //     // navigate to My Tasklist
  //               //     this._router.navigate(["/sm-tasklist"]);
  //               //   }
  //               // });
  //             }
  //           })
  //         }
  //       })

  //     },
  //     error: (e) => {
  //       console.error(e);
  //       // this.showError("Already Uploaded CRQ. Please upload a new CRQ");
  //       this.showMessage(severity.error, "Already Uploaded CRQ. Please upload a new CRQ.");

  //       // window.alert(`${this.crqNumber} already present`);
  //       // Alert message here.
  //     },
  //     complete: () => {
  //       console.info('checkAlreadyUploadedCrq complete');

  //     }
  //   })

  // }

  startProcessInstance() {
    if (!this.selectedRotaFile) {
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: `Please Upload Rota file for ${this.crqNumber}`
      });
      return;
    }

    this.disableStartBtn = true;

    const createdBy = localStorage.getItem('userEmail');
    if (!createdBy) {
      this.showMessage(severity.error, "CRQ number or user missing");
      this.disableStartBtn = false;
      return;
    }

    console.log("StartProcessInstance called.");

    // 🔥 1️⃣ CHECK CRQ (NEW ORDER)
    this._crqService.checkAlreadyUploadedCrq(this.crqNumber).subscribe({
      next: () => {
        console.log("CRQ check passed");

        // 🔥 2️⃣ SAVE CRQ DATA
        this._crqService.saveCrqData(this.crqData).subscribe({
          next: (saveResp: any) => {
            console.log("CRQ saved:", saveResp);
            localStorage.setItem('crqRef', saveResp.crqMainList[0].crqRef);
            localStorage.setItem('crqReleaseNum', saveResp.crqMainList[0].summary);

            // 🔥 3️⃣ SAVE ROTA FILE
            this._crqService.saveRotaFile(this.selectedRotaFile, this.crqNumber, createdBy).subscribe({
              next: () => {
                console.log("ROTA saved successfully");
                this.rotaFileUploaded = true;
                this._router.navigate(["/sm-tasklist"]);
                this.showMessage(severity.success, "CRQ Started");

                setTimeout(() => {


                  // 🔥 4️⃣ START CAMUNDA
                  this._crqService.startProcessInstance(this.crqNumber).subscribe({
                    next: (startResp) => {
                      console.log("Camunda process started:", startResp);
                      this.showMessage(severity.success, "CRQ Started");

                      // ✅ ADD THIS BLOCK
                      const payload = {
                        crqMain: {
                          crqRef: this.crqNumber   // already set correctly earlier
                        },
                        status: 'CRQ_STARTED'
                      };

                      this._crqService.smtpSendMail(payload).subscribe({
                        next: () => {
                          console.log('CRQ_STARTED notification sent');
                        },
                        error: (err) => {
                          console.error('Notification failed', err);
                        }
                      });
                      // ✅ END

                    },

                    error: (startError) => {
                      console.error("Camunda failed:", startError);
                      this.showMessage(severity.error, startError.error || "Process start failed");
                      this.disableStartBtn = false;
                    }
                  });
                }, 15000);
              },
              error: (previewError) => {
                console.error("ROTA validation failed:", previewError);
                this.showMessage(severity.error, "Invalid ROTA file");
                this.disableStartBtn = false;
              }
            });
          },
          error: (saveError) => {
            console.error("Save failed:", saveError);
            this.showMessage(severity.error, "Failed to save CRQ data");
            this.disableStartBtn = false;
          }
        });
      },
      error: (checkError) => {
        console.error("CRQ exists:", checkError);
        this.showMessage(severity.error, "Already Uploaded CRQ. Please upload a new CRQ.");
        this.disableStartBtn = false;
      }
    });
  }

  // startProcessInstance() {

  //   if (!this.selectedRotaFile) {
  //     this.messageService.add({
  //       severity: 'error',
  //       summary: 'Error',
  //       detail: `Please Upload Rota file for ${this.crqNumber}`
  //     });
  //     return;
  //   }

  //   this.disableStartBtn = true;

  //   const createdBy = localStorage.getItem('userEmail');
  //   if (!createdBy) {
  //     this.showMessage(severity.error, "CRQ number or user missing");
  //     this.disableStartBtn = false;
  //     return;
  //   }


  //   console.log("StartProcessInstance called.");

  //   // 🔥 1️⃣ PREVIEW ROTA (VALIDATION FIRST)
  //   this._crqService.saveRotaFile(this.selectedRotaFile, this.crqNumber, createdBy)
  //     .subscribe({

  //       next: () => {

  //         console.log("ROTA saved successfully");

  //         this.rotaFileUploaded = true;
  //         // 🔥 2️⃣ CHECK CRQ
  //         this._crqService.checkAlreadyUploadedCrq(this.crqNumber).subscribe({

  //           next: () => {

  //             console.log("CRQ check passed");

  //             // 🔥 3️⃣ START CAMUNDA
  //             this._crqService.startProcessInstance(this.crqNumber).subscribe({

  //               next: (startResp) => {

  //                 console.log("Camunda process started:", startResp);

  //                 // 🔥 4️⃣ SAVE CRQ DATA
  //                 this._crqService.saveCrqData(this.crqData).subscribe({

  //                   next: (saveResp: any) => {

  //                     console.log("CRQ saved:", saveResp);

  //                     localStorage.setItem('crqRef', saveResp.crqMainList[0].crqRef);
  //                     localStorage.setItem('crqReleaseNum', saveResp.crqMainList[0].summary);

  //                     this.showMessage(severity.success, "CRQ Started");

  //                     this._router.navigate(["/sm-tasklist"]);
  //                   },

  //                   error: (saveError) => {

  //                     console.error("Save failed:", saveError);
  //                     this.showMessage(severity.error, "Failed to save CRQ data");
  //                     this.disableStartBtn = false;
  //                   }

  //                 });

  //               },

  //               error: (startError) => {

  //                 console.error("Camunda failed:", startError);
  //                 this.showMessage(severity.error, startError.error || "Process start failed");
  //                 this.disableStartBtn = false;
  //               }

  //             });

  //           },

  //           error: (checkError) => {

  //             console.error("CRQ exists:", checkError);
  //             this.showMessage(severity.error, "Already Uploaded CRQ. Please upload a new CRQ.");
  //             this.disableStartBtn = false;
  //           }

  //         });

  //       },

  //       error: (previewError) => {

  //         console.error("ROTA validation failed:", previewError);

  //         this.showMessage(severity.error, "Invalid ROTA file");
  //         this.disableStartBtn = false;
  //       }

  //     });

  // }


  fileUploadError: string | null = null;

  async onUpload(event: FileUploadHandlerEvent) {

    this.disableStartBtn = false;

    const uploadedFile: File = event.files[0];

    console.log("TYPE : " + uploadedFile.type);

    // VALIDATIONS

    let allowedTypes = [
      'application/vnd.ms-excel',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    ];

    let maxFileSize = 1000000; // 1 MB

    this.fileUploadError = null;

    // const file: File = event.files?.[0];
    if (!uploadedFile) return;

    // ✅ File type validation
    if (!allowedTypes.includes(uploadedFile.type)) {
      this.fileUploadError =
        `${uploadedFile.name}: Invalid file type, allowed file types: ` +
        `.xls, .xlsx`;
      return;
    }

    // ✅ File size validation
    if (uploadedFile.size > maxFileSize) {
      this.fileUploadError =
        `${uploadedFile.name}: File size exceeds 1 MB`;
      return;
    }

    // VALIDATION ENDS

    let crqNumber: any;

    this.fileUploader.clear();

    console.log("upload called");

    // this._crqService.readFile()

    this._crqService.readFile(uploadedFile).subscribe({
      next: (crqData) => {
        console.log(crqData);
        this.uploadedCrqMainValue = crqData.crqMainList;
        console.log("CRQ REF : " + crqData.crqMainList[0].crqRef);
        this.crqNumber = crqData.crqMainList[0].crqRef;
        this.crqData = crqData;
        crqNumber = crqData.crqMainList[0].crqRef;
      },
      error: (e) => {
        console.error(e);
        // this.showError("Validation Failed.");
        this.showMessage(severity.error, "Please upload a valid CRQ file");
        this.showUploadedCrqTable = false;
      },
      complete: () => {
        this.showUploadedCrqTable = true;
        console.log("CRQ DATA IS : ")
        console.log(this.crqData);
        this.uploadedCrqValue = this.crqData.crqTasksList;
        console.info('File Readed Successfully');
      }
    })

  }

  // markIsStartedToTrue(crqRef: String | null): any {

  //   console.log("markIsStartedToTrue called .");
  //   const token = localStorage.getItem('token');
  //   const headers = token ? { Authorization: `Bearer ${token}` } : undefined;

  //   this._crqService.markIsStartedToTrue(crqRef).subscribe((data: any) => {
  //     console.log(data);
  //     console.log("updating uploadedCrqValue ");
  //     // this.uploadedCrqValue = data;
  //     return data;
  //   }, err => {
  //     console.log("markIsStartedToTrue error")
  //   }, () => {
  //     console.log("markIsStartedToTrue successful");
  //   })

  // }


  search(event: any) {
    // Simulate a search operation
    this.items = ['Application 1', 'Application 2', 'Application 3'].filter(item => item.toLowerCase().includes(event.query.toLowerCase()));
    console.log("search called" + this.selectedComponent);
  }

  select(event: any) {

    const selectedComp = event.toString().toLowerCase().replace(/\s+/g, '');
    console.log("selected comp" + selectedComp);

    let template = '';
    switch (selectedComp) {
      case 'application1': template = 'Template1'; break;
      case 'application2': template = 'Template2'; break;
      case 'application3': template = 'Template3'; break;
      default: template = 'Template1';
    }

  }

  toggleTaskSelection(task: SM, checked: boolean) {
    const template = this.selectedComponent.toLowerCase().replace(/\s+/g, '') === 'component1'
      ? 'Template1' : this.selectedComponent.toLowerCase().replace(/\s+/g, '') === 'component2'
        ? 'Template2' : 'Template3';

    if (!this.selectedTasks.has(template)) {
      this.selectedTasks.set(template, []);
    }

    let tasks = this.selectedTasks.get(template)!;

    if (checked) {
      if (!tasks.some(t => t.id === task.id)) {
        tasks.push(task);
      }
    } else {
      this.selectedTasks.set(template, tasks.filter(t => t.id !== task.id));
    }
  }

  sendTasks() {
    const allSelected: SM[] = Array.from(this.selectedTasks.values()).flat();
    if (allSelected.length === 0) {
      alert("⚠️ Please select at least one task before sending.");
      return;
    }

    this.isLoading = true;
    // Generate CRQ ticket
    const timestamp = Date.now() % 10000000;
    const crqTicket = "CRQ" + timestamp;

    // Map DeploymentDetails → SelectedTask DTO
    const tasks = allSelected.map(task => ({
      activity: task.activity,
      impactedService: task.impactedService,
      plannedStartDate: task.plannedStartDate,
      plannedEndDate: task.plannedEndDate,
      department: task.department,
      template: task.template,
      submitted: true,
      // crqTicket: crqTicket
    }));

    console.log(tasks);

    const payload = {
      crqTicket: this.crqNumber,
      tasks: tasks
    };

    // calling AI Predict

    let activities = tasks.map(task => task.activity);

    this._aiService.predict(activities).subscribe((data: any) => {
      let resp = JSON.parse(data);
      this.predictResp = resp.insights;
    }, err => console.error("error ai resp")
      , () => {
        this.showAiBell = true;
        this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Click 🔔 to view notifications' });
        this.isLoading = false;
      }
    )

    console.log(this.selectedTasks);

    this._crqService.saveSelectedTasks(payload).subscribe({
      next: () => {
        // this.messageService.add({ severity: 'success', summary: 'Success', detail: '' });
        // alert(`✅ Tasks submitted successfully! `);
        // below not working
        this.selectedTasks.clear();
        // Navigate to tasklist and pass CRQ ticket
        setTimeout(() => {
          // changed
          // this._router.navigate(['/sm-tasklist']);
        }, 1000);
      },
      error: (err) => {
        console.error(err);
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Message Content' });
        // alert("❌ Failed to save tasks");
      }
    });

  }

  setDependencies() {
    console.log("Set Dependencies Clicked");
    // Navigate to the task list component with selected tasks as state.
    this._router.navigate(['/set-dependencies']);
  }

  showAiBell: boolean = false;

  predictResp!: any;

  cols!: Column[];

  visible: boolean = false;

  position: 'left' | 'right' | 'top' | 'bottom' | 'center' | 'topleft' | 'topright' | 'bottomleft' | 'bottomright' = 'center';

  showAIresponse(position: 'left' | 'right' | 'top' | 'bottom' | 'center' | 'topleft' | 'topright' | 'bottomleft' | 'bottomright') {
    this.position = position;
    this.visible = true;
  }

  // showError(messageContent: string) {
  //   this.messageService.add({ severity: 'error', summary: 'Error', detail: messageContent, life: 5000 });
  //   // this.messageService.add({ severity: 'error', summary: 'Error', detail: messageContent, sticky: true });
  // }

  // showInfo(messageContent: string) {
  //   this.messageService.add({ severity: 'success', summary: 'success', detail: messageContent, life: 3000 });
  // }

  showMessage(severityType: severity, messageContent: string) {
    this.messageService.add({ severity: severityType, summary: severityType.toString(), detail: messageContent, life: 10000 });
  }

  onCancelUpload() {
    this.fileUploader.clear();
    this.showUploadedCrqTable = false;
  }

  convertDate(date: string): string {
    console.log('date : ' + date);
    let dateArr = date.substring(0, date.lastIndexOf(' ')).split('-');
    return `${dateArr[1] + '-' + dateArr[0] + '-' + dateArr[2]}`;
  }

  onRotaFileSelect(event: any) {

    const file: File = event.target.files[0];

    if (!file) return;

    this.selectedRotaFile = file;

    console.log("🔥 ROTA file selected");

    // 🔥 CALL PREVIEW API HERE
    this._crqService.previewRotaFile(file).subscribe({

      next: (res: any) => {

        console.log("✅ Preview response:", res);

        this.rotaPreviewData = res;
        this.showRotaPreview = true

        this.showMessage(severity.success, "ROTA file has been successfully uploaded");
      },

      error: (err) => {

        console.error("❌ Preview failed:", err);

        this.showRotaPreview = false;
        this.rotaPreviewData = [];

        this.showMessage(severity.error, "Please upload a valid ROTA file");
      }
    });
  }


  confirmRotaUpload() {

    if (!this.selectedRotaFile) {
      this.showMessage(severity.error, "No file selected");
      return;
    }

    const crqNumber = this.uploadedCrqMainValue?.[0]?.crqRef;
    const createdBy = localStorage.getItem('userEmail');

    if (!crqNumber || !createdBy) {
      this.showMessage(severity.error, "CRQ number or user missing");
      return;
    }

    // 🔥 STEP 2: SAVE
    this._crqService.saveRotaFile(this.selectedRotaFile, crqNumber, createdBy)
      .subscribe({

        next: (res) => {
          console.log("Saved:", res);

          this.rotaFileUploaded = true;
          this.showRotaPreview = false;

          this.showMessage(severity.success, "ROTA saved successfully");
        },

        error: (err) => {
          console.error(err);
          this.rotaFileUploaded = false;

          this.showMessage(severity.error, "Failed to save ROTA");
        }
      });
  }


  onCancelRotaUpload(rotaInput: HTMLInputElement) {
    rotaInput.value = '';
    this.rotaFileUploaded = false;
    this.showRotaPreview = false;
    this.rotaPreviewData = [];
  }

}
