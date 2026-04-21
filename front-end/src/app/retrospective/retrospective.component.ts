import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { TableModule } from 'primeng/table';

import { ButtonModule } from 'primeng/button';
import { Router, RouterLink } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { environment } from 'src/environment/environment.dev';

@Component({
    selector: 'app-retrospective',
    standalone: true,
    imports: [
        CommonModule,
        ReactiveFormsModule,
        TableModule,
        FormsModule,
        ButtonModule,
        ToastModule,
        RouterLink
    ],
    providers: [MessageService],
    templateUrl: './retrospective.component.html',
    styleUrls: ['./retrospective.component.scss'],
})
export class RetrospectiveComponent implements OnInit {
    retroForm!: FormGroup;
    retro: any[] = [];
    crqNumber: string | any = '';
    crqReleaseNumber: string | any = "";
    constructor(private fb: FormBuilder, private router: Router,
        private http: HttpClient,
        private messageService: MessageService) {
        this.retroForm = this.fb.group({
            rca: [''],
            preventiveAction: [''],
            additionalComments: ['']
        });
    }

    feedbackFun(event: any, task: any, type: any) {
        // console.log("rca called");
        // console.log("task"+task.id);
        // console.log("rca value "+event.target.value);

        let value = event.target.value;

        this.retro.forEach((elem: any) => {

            switch (type) {
                case 'rca':
                    if (elem.id == task.id) elem.rca = value;
                    break;
                case 'preventiveAction':
                    if (elem.id == task.id) elem.preventiveAction = value;
                    break;
                case 'additionalComments':
                    if (elem.id == task.id) elem.additionalComments = value;
                    break;
                default:
                    break;
            }
        })

        console.log("final retro ");
        this.retro.forEach(elem => console.log(elem));

    }

    ngOnInit(): void {
        this.crqNumber = localStorage.getItem('crqRef');
        this.crqReleaseNumber = localStorage.getItem('crqReleaseNum');


        const token = localStorage.getItem('token');
        const headers = token ? { Authorization: `Bearer ${token}` } : undefined;

        this.http.get<any[]>(`${environment.urls.crqService}/crq/getAllTasks/${this.crqNumber}`, { headers })
            .subscribe(data => {
                //    this.crqNumber = data[0]?.crqTicket;
                this.retro = data.filter(item => item.rag == 'AMBER' || item.rag == 'RED');
                console.log('Fetched retrospective data:', this.retro);

            }, err => console.error(err));


    }
    // Old code
    // onSubmit(): void {
    //     // console.log("retro value "+this.retro);

    //     console.log("from front " + this.retro);

    //     let retrospectivePayload: any[] = [];

    //     this.retro.forEach(elem => {
    //         let e: any = {};
    //         e.taskId = elem.id;
    //         e.rca = elem.rca;
    //         e.preventiveAction = elem.preventiveAction;
    //         e.additionalComments = elem.additionalComments;
    //         // console.log(e);
    //         retrospectivePayload.push(e);
    //     });

    //     retrospectivePayload.forEach(elem => console.log(elem));

    //     this.retrospectiveFeedbackFun(retrospectivePayload);

    //     // console.log('Form submitted:', this.retroForm.value);
    // }

    // retrospectiveFeedbackFun(payload: any) {

    //     const token = localStorage.getItem('token');
    //     const headers = token ? { Authorization: `Bearer ${token}` } : undefined;

    //     // 1) Save/Upsert batch to backend
    //     this.http.post(`${environment.urls.crqService}/retro/saveRetro`, payload, { headers, responseType: 'text' })
    //         .subscribe((data: any) => console.log(data), err => console.error(err), () => this.messageService.add({ severity: 'success', summary: 'Retrospective Saved Successfully' }));
    // }
    isSaveEnabled(): boolean {
        return this.retro?.some(elem =>
            elem.rca?.trim() ||
            elem.preventiveAction?.trim() ||
            elem.additionalComments?.trim()
        );
    }

    // onSubmit(): void {

    //     const retrospectivePayload = this.retro
    //         .filter(elem => elem.id != null)   // safety
    //         .map(elem => ({
    //             taskId: elem.id,               // ✅ MUST MATCH BACKEND
    //             rca: elem.rca,
    //             preventiveAction: elem.preventiveAction,
    //             additionalComments: elem.additionalComments
    //         }));

    //     console.log('Final payload:', retrospectivePayload);

    //     this.retrospectiveFeedbackFun(retrospectivePayload);
    // }
    onSubmit(): void {

        console.log("RETRO BEFORE SUBMIT:", this.retro);

        const retrospectivePayload = this.retro.map(elem => ({
            taskId: elem.taskId,
            rca: elem.rca ?? '',
            preventiveAction: elem.preventiveAction ?? '',
            additionalComments: elem.additionalComments ?? ''
        }));

        console.log("Final payload:", retrospectivePayload);

        this.retrospectiveFeedbackFun(retrospectivePayload);
    }

    retrospectiveFeedbackFun(payload: any[]) {

        const token = localStorage.getItem('token');
        const headers = token ? { Authorization: `Bearer ${token}` } : undefined;

        if (!Array.isArray(payload)) {
            console.error('Payload must be an array');
            return;
        }

        // ✅ STEP 1: SAVE DATA
        this.http.post(
            `${environment.urls.crqService}/retro/saveRetro`,
            payload,
            { headers, responseType: 'text' }
        ).subscribe({

            next: (res) => {
                console.log(res);

                // ✅ STEP 2: CALL TEAMS API (IMPORTANT)
                this.sendRetroToTeams();

                this.messageService.add({
                    severity: 'success',
                    summary: 'Retrospective Saved Successfully'
                });
            },

            error: (err) => {
                console.error(err);
                this.messageService.add({
                    severity: 'error',
                    summary: 'Save Failed'
                });
            }
        });
    }
    // sendRetroToTeams() {

    //     const token = localStorage.getItem('token');
    //     const headers = token ? { Authorization: `Bearer ${token}` } : undefined;

    //     this.http.post(
    //         `${environment.urls.teamsService}/teams/send-retro/${this.crqNumber}`,
    //         {},
    //         { headers, responseType: 'text' }
    //     ).subscribe({
    //         next: (res) => {
    //             console.log("Teams Response:", res);

    //             // this.messageService.add({
    //             //     severity: 'success',
    //             //     summary: 'Teams Notification Sent'
    //             // });
    //         },
    //         error: (err) => {
    //             console.error(err);

    //             this.messageService.add({
    //                 severity: 'warn',
    //                 summary: 'Saved but Teams notification failed'
    //             });
    //         }
    //     });
    // }



    sendRetroToTeams() {

        const token = localStorage.getItem('token');

        const headers = new HttpHeaders({
            Authorization: `Bearer ${token}`
        });

        this.http.post(
            `${environment.urls.crqService}/retro/send-retro/${this.crqNumber}`,
            {},
            { headers, responseType: 'text' }
        ).subscribe({
            next: (res) => {
                console.log("✅ Retro sent:", res);

                this.messageService.add({
                    severity: 'success',
                    summary: 'Retro Report Sent Successfully',
                    // detail: res
                });
            },
            error: (err) => {
                console.error("❌ Retro failed:", err);
            }
        });
    }


    onCancel(): void {
        this.retroForm.reset();
    }

    getStatusClass(employee: any): string {
        if (!employee) return 'bg-grey text-white';
        const status = (employee.status || '').toLowerCase();

        if (status === 'failed') return 'bg-red-400 text-white';
        if (status === 'completed') return 'bg-green text-white';
        if (status === 'not started' || !status) return 'bg-grey text-white';
        if (status === 'assigned') return 'bg-yellow-400 text-white';
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

    exportToExcel(): void {

        const token = localStorage.getItem('token');
        const headers = token ? { Authorization: `Bearer ${token}` } : undefined;

        this.http.get(
            `${environment.urls.crqService}/retro/export/${this.crqNumber}`,
            {
                headers,
                responseType: 'blob'
            }
        ).subscribe({
            next: (blob: Blob) => {

                const a = document.createElement('a');
                const objectUrl = URL.createObjectURL(blob);

                a.href = objectUrl;
                a.download = `Retrospective_${this.crqNumber}.xlsx`;
                a.click();

                URL.revokeObjectURL(objectUrl);

                // ✅ Success Toast Message
                this.messageService.add({
                    severity: 'success',
                    summary: 'Success',
                    detail: 'Report downloaded successfully'
                });
            },
            error: (err) => {
                console.error(err);

                // ❌ Error Toast
                this.messageService.add({
                    severity: 'error',
                    summary: 'Error',
                    detail: 'Failed to download report'
                });
            }
        });
    }


}
