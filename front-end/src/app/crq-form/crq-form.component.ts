import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { CrqDraftService } from './crq-form.service';
import { MessageService } from 'primeng/api';
import { environment } from 'src/environment/environment.dev';
import { HttpClient } from '@angular/common/http';
import { HttpHeaders } from '@angular/common/http';
import { DatePickerModule } from 'primeng/datepicker';


@Component({
  selector: 'app-crq-form',
  standalone: true,
  imports: [CommonModule, FormsModule, InputTextModule, ButtonModule, DatePickerModule],
  providers: [MessageService],
  templateUrl: './crq-form.component.html',
  styleUrl: './crq-form.component.css',
})



export class CrqFormComponent implements OnInit {

  constructor(private router: Router,
    private draftService: CrqDraftService,
    private http: HttpClient,
    private messageService: MessageService
  ) { }

  crqForm: any = {
    crqRef: '',
    summary: '',
    affectedServices: '',
    author_contact: '',
    lastUpdatedDateTime: new Date()
  };

  teamDetailsList: string[] = [
    'TA Team',
    'Accenture Dev L3',
    'CC & Retail DVT',
    'Channel',
    'SIT',
    'Accord',
    'CMT',
    'Cross-Join',
    'Domain RM',
    'ecare DVT',
    'Edge',
    'IT Release Management',
    'L2 Ops',
    'Retail L2',
    'CUR',
    'MVA DVT',
    'Online Catalogue',
    'Order Repush',
    'TIL',
    'TOBI',
    'VCI',
    'VF Operations',
    'MIM'
  ];

  crqRows: any[] = [];
  status: string = 'DRAFT';
  isDeploymentManager: boolean = true;
  crqSaved = false;
  minDate: Date = new Date();
  durationTempSet = new WeakMap<any, boolean>();


  ngOnInit(): void {
    this.crqForm.lastUpdatedDateTime = new Date();

    if (this.crqRows.length === 0) {
      this.addRow();
    }
  }

  createEmptyRow() {
    return {
      customerImpact: '',
      serviceOutage: '',
      activity: '',
      impactedService: '',
      startDateTime: '',
      duration: this.getZeroTime(),
      endDateTime: '',
      teamDetails: '',
      pocNames: '',
      pocEmailDetails: '',
      supportContactDetails: '',
      additionalNotes: '',
      isManuallyEdited: false
    };
  }

  addRow() {
    this.crqRows.push(this.createEmptyRow());
  }

  removeRow(index: number) {
    if (this.crqRows.length > 1) {
      this.crqRows.splice(index, 1);
    }
  }
  moveRowUp(index: number) {
    if (index > 0) {
      const temp = this.crqRows[index];
      this.crqRows[index] = this.crqRows[index - 1];
      this.crqRows[index - 1] = temp;
    }
  }

  moveRowDown(index: number) {
    if (index < this.crqRows.length - 1) {
      const temp = this.crqRows[index];
      this.crqRows[index] = this.crqRows[index + 1];
      this.crqRows[index + 1] = temp;
    }
  }

  isFormValid(): boolean {
    const main = this.crqForm;

    const isMainValid =
      main.crqRef?.trim() &&
      main.summary?.trim() &&
      main.affectedServices?.trim() &&
      main.author_contact?.trim();

    const areRowsValid = this.crqRows.every((row: any) =>
      row.customerImpact &&
      row.serviceOutage &&
      row.activity?.trim() &&
      row.activity.length <= 4000 &&
      row.impactedService?.trim() &&
      row.impactedService.length <= 1000 &&
      row.startDateTime &&
      this.isFutureDate(row.startDateTime) &&
      row.duration &&
      row.endDateTime &&
      this.isFutureDate(row.endDateTime) &&
      row.teamDetails &&
      row.pocNames?.trim() &&
      row.pocEmailDetails?.trim() &&
      row.supportContactDetails?.trim()
    );

    return isMainValid && areRowsValid;
  }

  // 🚀 FINAL SAVE METHOD (API INTEGRATED)
  saveCrqForm() {

    if (!this.isFormValid()) {
      alert("Please fill all mandatory fields");
      this.crqSaved = false;
      return;
    }

    const payload = {
      main: {
        crqRef: this.crqForm.crqRef,
        summary: this.crqForm.summary,
        affectedServices: this.crqForm.affectedServices,
        author_contact: this.crqForm.author_contact,
        // lastUpdatedDateTime: new Date().toISOString(),
        deploymentStatus: 'DRAFT'
      },
      tasks: this.crqRows.map((row, index) => ({
        srNo: (index + 1).toString(),

        // ✅ FIX 1: convert Yes/No → boolean
        customerImpact: row.customerImpact === 'Yes',
        serviceOutage: row.serviceOutage === 'Yes',

        activity: row.activity,
        impactedService: row.impactedService,
        plannedStartDateTime: this.appendSeconds(row.startDateTime),
        plannedEndDateTime: this.appendSeconds(row.endDateTime),
        duration: row.duration,
        teamDetails: row.teamDetails,
        pocName: row.pocNames,
        pocEmail: row.pocEmailDetails,

        // ✅ FIX 2: clean unwanted quotes if any
        supportTeamContact: row.supportContactDetails?.replace(/^'+/, ''),

        additionalNotes: row.additionalNotes
      }))
    };

    console.log("Sending Payload:", payload);

    this.draftService.saveDraft(payload).subscribe({
      next: (res: any) => {
        console.log("Saved:", res);
        alert("CRQ Saved Successfully");
        this.crqSaved = true;
      },
      error: (err) => {
        console.error("Error:", err);
        alert("Error saving CRQ");
        this.crqSaved = false;
        alert("Please fill all mandatory fields");
      }
    });
  }

  exportToExcel(): void {

    const token = localStorage.getItem('token');

    const headers = token
      ? new HttpHeaders({ Authorization: `Bearer ${token}` })
      : new HttpHeaders();

    this.http.get(
      `${environment.urls.crqService}/createcrq/export?crqRef=${this.crqForm.crqRef}&type=${this.status}`,
      {
        headers: headers,
        responseType: 'blob' as 'json'
      }
    ).subscribe(
      (blob: any) => {

        const a = document.createElement('a');
        const objectUrl = URL.createObjectURL(blob);

        a.href = objectUrl;
        a.download = `CRQ_${this.crqForm.crqRef}.xlsx`;
        a.click();

        URL.revokeObjectURL(objectUrl);

        this.messageService.add({
          severity: 'success',
          summary: 'Success',
          detail: 'Report downloaded successfully'
        });
      },
      (err: any) => {
        console.error(err);

        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Failed to download report'
        });
      }
    );
  }

  onDateOrDurationChange(row: any) {

    if (!row.startDateTime || !row.duration) {
      row.endDateTime = null;
      return;
    }

    if (row.isManuallyEdited) return;

    const start = new Date(row.startDateTime);
    const end = new Date(start);

    const durationDate = new Date(row.duration);

    const hours = durationDate.getHours();
    const minutes = durationDate.getMinutes();
    const seconds = durationDate.getSeconds();

    end.setHours(end.getHours() + hours);
    end.setMinutes(end.getMinutes() + minutes);
    end.setSeconds(end.getSeconds() + seconds);

    row.endDateTime = end;
  }
  isValidDuration(date: any): boolean {
    if (!date) return false;

    const d = new Date(date);

    return (
      d.getHours() >= 0 &&
      d.getMinutes() >= 0 &&
      d.getSeconds() >= 0
    );
  }
  getZeroTime(): Date {
    const d = new Date();
    d.setHours(0, 0, 0, 0);
    return d;
  }
  // resetIfEmpty(row: any) {
  //   if (!row.duration) {
  //     row.duration = this.getZeroTime();
  //   }
  // }// in html -----> (onFocus)="resetIfEmpty(row)"
  formatToLocalDateTime(date: Date): string {
    const pad = (n: number) => n.toString().padStart(2, '0');

    return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}`;
  }

  isFutureDate(date: any): boolean {
    if (!date) return false;

    const selected = new Date(date);
    const now = new Date();

    return selected.getTime() > now.getTime(); // strictly future
  }
  appendSeconds(date: any): string {
    if (!date) return '';

    const d = new Date(date);

    const pad = (n: number) => n.toString().padStart(2, '0');

    return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`;
  }

  // getCurrentDateTime(): string {
  //   const now = new Date();

  //   const pad = (n: number) => n.toString().padStart(2, '0');

  //   return `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())}T${pad(now.getHours())}:${pad(now.getMinutes())}`;
  // }

  onEndDateChange(row: any) {

    if (!this.isFutureDate(row.endDateTime)) {
      alert("End Date/Time must be in the future");

      row.endDateTime = '';
      row.isManuallyEdited = false;
      return;
    }

    // mark as manually edited only if valid
    row.isManuallyEdited = true;
  }

  onStartDateChange(row: any) {

    // 🔥 Reset manual override
    row.isManuallyEdited = false;

    // 🔥 STRICT validation (blocks even if browser allows selection)
    if (!this.isFutureDate(row.startDateTime)) {
      alert("Start Date/Time must be in the future");

      row.startDateTime = '';
      row.endDateTime = '';
      return;
    }

    this.onDateOrDurationChange(row);
  }

  onDurationFocus(row: any) {
    if (!row.duration) {
      row.duration = this.getZeroTime();
      this.durationTempSet.set(row, true);
    }
  }

  onDurationBlur(row: any) {

    if (this.durationTempSet.get(row)) {
      // user didn’t change → revert back
      row.duration = null;
      this.durationTempSet.delete(row);
    }
  }


}
