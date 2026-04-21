import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { RetroTableService } from './retro-table.service';
import { TableModule } from "primeng/table";
import { CommonModule } from '@angular/common';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';

@Component({
  selector: 'app-retro-table',
  standalone: true,
  providers: [MessageService],
  imports: [TableModule, CommonModule, ToastModule],
  templateUrl: './retro-table.component.html',
  styleUrl: './retro-table.component.css',
})
export class RetroTableComponent implements OnChanges {

  @Input() public crqRefNumberFromParent: string = '';

  public retroTableColumns: any[] = [];
  public retroTableData: any[] = [];
  public showRetroTable: boolean = false;

  constructor(private _retroTableService: RetroTableService) { }

  ngOnChanges(changes: SimpleChanges): void {

    console.log("CRQ RECEIVED:", this.crqRefNumberFromParent); // 🔍 debug

    if (changes['crqRefNumberFromParent'] && this.crqRefNumberFromParent) {

      this.retroTableColumns = [
        // { field: 'taskId', header: 'Task ID' },
        { field: 'srNo', header: 'Sr No' },
        { field: 'activity', header: 'Activity' },
        { field: 'teamDetails', header: 'Team Details' },
        { field: 'status', header: 'Status' },
        { field: 'rag', header: 'Rag' },
        { field: 'comments', header: 'Comments' },
        { field: 'rca', header: 'RCA' },
        { field: 'preventiveAction', header: 'Preventive Action' },
        { field: 'additionalComments', header: 'Additional Comments' },
      ];

      this.getRetroByCrqRef(this.crqRefNumberFromParent);
    }
  }

//   public getRetroByCrqRef(crqReferenceNumber: string) {

//     console.log("RETRO API CALL:", crqReferenceNumber); // 🔍 debug

//     this.retroTableData = []; // reset old data

//     this._retroTableService.getRetroByCrqRef(crqReferenceNumber).subscribe({
//       next: (v) => {
//         console.log("RETRO RESPONSE:", v); // 🔍 debug
//         // this.retroTableData = v;

//         if (!v || v.length === 0) {
//           this.retroTableData = v || [];
//           this.showRetroTable = false;   // ❌ hide table
//           return;
//         }
//         this.retroTableData = v.map((item: any, index: number) => ({
//           ...item,
//           srNo: index + 1   // ✅ ADD HERE
//         }));

//       },

//       error: (e) => console.error("RETRO ERROR:", e),
//       complete: () => {
//         this.showRetroTable = true;
//       }
//     });
//   }
// }
public getRetroByCrqRef(crqReferenceNumber: string) {

  console.log("RETRO API CALL:", crqReferenceNumber);

  this.retroTableData = [];
  this.showRetroTable = false; // loader

  this._retroTableService.getRetroByCrqRef(crqReferenceNumber).subscribe({

    next: (v) => {
      console.log("RETRO RESPONSE:", v);

      this.retroTableData = (v || []).map((item: any, index: number) => ({
        ...item,
        srNo: index + 1
      }));
    },

    error: (e) => {
      console.error("RETRO ERROR:", e);
      this.retroTableData = [];
    },

    complete: () => {
      this.showRetroTable = true; // ✅ ALWAYS TRUE
    }
  });
}
}