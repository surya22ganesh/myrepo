import { Component, Input, OnInit } from '@angular/core';
import { RotaTableService } from './rota-table.service';
import { TableModule } from "primeng/table";
import { CommonModule } from '@angular/common';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';

@Component({
  selector: 'app-rota-table',
  standalone: true,
  providers: [MessageService],
  imports: [TableModule, CommonModule, ToastModule],
  templateUrl: './rota-table.component.html',
  styleUrl: './rota-table.component.css',
})
export class RotaTableComponent implements OnInit {

  @Input() public crqRefNumberFromParent: string = '';

  public rotaTableColumns: any[] = [];
  public rotaTableData: any[] = [];
  public showRotaTable: boolean = false;

  ngOnInit(): void {

    this.rotaTableColumns = [
      // { field: 'crqNumber', header: 'CRQ Number' },
      { field: 'supportTeam', header: 'Support Team' },
      { field: 'shiftDetails', header: 'Shift Details' },
      { field: 'pocName', header: 'POC Name' },
      { field: 'pocEmail', header: 'POC Email' },
      { field: 'supportTeamContact', header: 'Support Team Contact' },
      // { field: 'createdBy', header: 'Created By' },
      // { field: 'createdDate', header: 'Created Date' },
      // { field: 'updatedBy', header: 'Updated By' },
    ];

    this.getRotaByCrqRef(this.crqRefNumberFromParent);

  }

  constructor(private _rotaTableService: RotaTableService) { }

  public getRotaByCrqRef(crqReferenceNumber: string) {
    this._rotaTableService.getRotaByCrqRef(crqReferenceNumber).subscribe({
      next: (v) => {
        this.rotaTableData = v;
      },
      error: (e) => console.error(e),
      complete: () => {
        console.info('complete');
        this.showRotaTable = true;
      }
    })
  }

}
