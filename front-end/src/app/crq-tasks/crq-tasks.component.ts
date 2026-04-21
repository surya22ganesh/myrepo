import { HttpClient } from '@angular/common/http';
import { Component, OnInit, Input } from '@angular/core';
import { Route, Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { CreateCrqService } from '../create-crq/create-crq.service';
import { TableModule } from 'primeng/table';
import { CommonModule } from '@angular/common';
import { ProgressSpinnerModule } from 'primeng/progressspinner';

@Component({
  selector: 'app-crq-tasks',
  imports: [TableModule, CommonModule, ProgressSpinnerModule],
  templateUrl: './crq-tasks.component.html',
  styleUrl: './crq-tasks.component.css',
})
export class CrqTasksComponent implements OnInit {

  // crqNumber:string = "CRQ30337";

  @Input() public crqRefNumberFromParent: string = '';
  crqNumber: string = "";

  showCrqTasksTable: boolean = false;
  crqTaskTableData: any[] = [];

  ngOnInit(): void {

    this.crqTaskTableColumns = [
      { field: 'srNo', header: 'S.No' },
      { field: 'customerImpact', header: 'Customer Impact' },
      { field: 'serviceOutage', header: 'Service/Server Outage' },
      // { field: 'crqRef', header: 'CRQ Ref' },
      // { field: 'releaseNumber', header: 'Release Number' },
      { field: 'activity', header: 'Activity' },
      { field: 'impactedService', header: 'Impacted Service' },
      { field: 'plannedStartDateTime', header: 'Planned Start Date/Time' },
      { field: 'duration', header: 'Planned Duration' },
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

    this.getCrqTasks(this.crqRefNumberFromParent);
  }

  public crqTaskTableColumns: any[] = [];

  constructor(
    private router: Router,
    private http: HttpClient,
    private messageService: MessageService,
    private _crqService: CreateCrqService
  ) { }


  public getCrqTasks(crqRef: string) {
    // Getting CRQ Data

    this._crqService.getTasksByCrqRefByQuery(crqRef).subscribe({
      next: (dataWithHeaders) => {
        console.log(dataWithHeaders);
        // this.crqTaskTableData = dataWithHeaders.body;
        this.crqTaskTableData = dataWithHeaders.body.map((item: any) => ({
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
        this.showCrqTasksTable = true;
      }
    });

  }


}
