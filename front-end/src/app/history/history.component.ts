import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { DatePickerModule } from 'primeng/datepicker';
import { ButtonModule } from 'primeng/button';
import { HistoryService } from './history.service';
import { TableModule } from "primeng/table";
import { CommonModule } from '@angular/common';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { CrqTasksComponent } from "../crq-tasks/crq-tasks.component";
import { RotaTableComponent } from "../rota-table/rota-table.component";
import { Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';
import { RetroTableComponent } from '../retro-table/retro-table.component';
import { AutoCompleteCompleteEvent, AutoCompleteModule } from 'primeng/autocomplete';
import { ProgressSpinnerModule } from 'primeng/progressspinner';

@Component({
  selector: 'app-history',
  standalone: true,
  providers: [MessageService],
  imports: [AutoCompleteModule, ProgressSpinnerModule, DatePickerModule, FormsModule, ButtonModule, TableModule, CommonModule, ToastModule, CrqTasksComponent, RotaTableComponent, RetroTableComponent],
  templateUrl: './history.component.html',
  styleUrl: './history.component.css',
})
export class HistoryComponent implements OnInit {

  selectedItem: any;
  filteredItems: any[] | undefined;

  items: any[] | undefined;

  showCrqMainTableData: boolean = false;
  uploadedCrqMaincols: any[] = [];
  crqMainTableData: any[] = [];
  showTable: string = '';
  crqReferenceNumber: string = '';
  showOptions: boolean = false;
  crqMainTableCount: number = 0;
  crqList: any[] = [];
  isListView: boolean = true;
  fullCrqList: any[] = [];
  filterCrq: string = '';
  filterStatus: string = '';
  loading: boolean = false;

  options :any = [
    { label: 'Option 1', value: 1 },
    { label: 'Option 2', value: 2 },
    { label: 'Option 3', value: 3 }
  ];
  selectedOption: any;


  constructor(private _historyService: HistoryService, private messageService: MessageService, private router: Router) { }

  ngOnInit(): void {
    // this.uploadedCrqMaincols = [
    //   // { field: "crqRef"},
    //   { field: "summary", header: "Summary" },
    //   { field: "affectedServices", header: "Affected Services" },
    //   { field: "author_contact", header: "Author/Contact" },
    //   // { field: "createdDateTime", header: "Created Date Time" },
    //   { field: "lastUpdatedDateTime", header: "Last Updated Date" },
    // ];

    console.log("INIT CALLED");
    this.loadAllCrqs();

    // ✅ THIS IS THE KEY FIX
    this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe((event: any) => {

        if (event.urlAfterRedirects === '/crq-history') {
          console.log("Records tab clicked → resetting");

          this.reset();  // 🔥 your existing reset method
        }

      });
  }

  // filterItems(event: AutoCompleteCompleteEvent) {
  //   //in a real application, make a request to a remote url with the query and return filtered results, for demo we filter at client side
  //   let filtered: any[] = [];
  //   let query = event.query;

  //   for (let i = 0; i < (this.items as any[]).length; i++) {
  //     let item = (this.items as any[])[i];
  //     if (item.label.toLowerCase().indexOf(query.toLowerCase()) == 0) {
  //       filtered.push(item);
  //     }
  //   }

  //   this.filteredItems = filtered;
  // }

  loadAllCrqs() {
    this.loading = true; // 🔥 START

    this._historyService.getAllCrqs().subscribe({
      next: (res) => {

        const data = res.body || [];

        const sortedData = data.sort((a: any, b: any) => {
          return this.parseDate(b.lastUpdatedDateTime) - this.parseDate(a.lastUpdatedDateTime);
        });

        this.fullCrqList = sortedData;
        this.crqMainTableData = sortedData;
        this.crqMainTableCount = sortedData.length;

        this.isListView = true;
        this.showCrqMainTableData = false;
        this.showOptions = false;
        this.showTable = '';
      },
      error: () => {
        this.showError("Failed to load CRQs");
      },
      complete: () => {
        this.loading = false; // 🔥 STOP
      }
    });
  }


  convertDate(date: string): string {
    // console.log('date : ' + date);
    let dateArr = date.substring(0, date.lastIndexOf(' ')).split('-');
    return `${dateArr[0] + '/' + dateArr[1] + '/' + dateArr[2]}`;
  }

  fromDate: Date | undefined | null;

  toDate: Date | undefined | null;

  fromDateFormatted: string = "";

  toDateFormatted: string = "";

  sampleData: string = "sample data from parent";

  selectedCrq: any;

  selCrq(rowData: any) {
    this.selectedCrq = rowData;

    this.crqReferenceNumber = rowData.crqRef;
    this.isListView = false;
    this.showCrqMainTableData = true;
    this.showOptions = true;

    this.crqMainTableData = [rowData]; // ✅ correct
  }

  applyFilters() {

    let filtered = [...this.fullCrqList];

    // 🔍 CRQ FILTER
    if (this.filterCrq && this.filterCrq.trim() !== '') {
      filtered = filtered.filter(item =>
        item.crqRef
          ?.toLowerCase()
          .includes(this.filterCrq.toLowerCase())
      );
    }

    // 📅 DATE FILTER (using time also ✅)
    if (this.fromDate && this.toDate) {
      const from = this.fromDate.getTime();
      const to = this.toDate.getTime();

      filtered = filtered.filter(item => {
        const itemDate = this.parseDate(item.lastUpdatedDateTime);
        return itemDate >= from && itemDate <= to;
      });
    }

    // 🚦 STATUS FILTER
    if (this.filterStatus && this.filterStatus !== '') {
      filtered = filtered.filter(item =>
        this.getStatusLabel(item.deploymentStatus) === this.filterStatus
      );
    }

    this.crqMainTableData = filtered;
    this.crqMainTableCount = filtered.length;
  }

  reset() {
    this.crqMainTableData = [];
    this.showTable = '';
    this.showOptions = false;
    this.isListView = true;
    this.loadAllCrqs();
  }

  getFromDate(event: Event) {
    this.fromDateFormatted = (event.target as HTMLInputElement).value;
    this.applyFilters();
  }

  getToDate(event: Event) {
    this.toDateFormatted = (event.target as HTMLInputElement).value;
    this.applyFilters();
  }

  getCrqMainTasks() {

    this.messageClear();

    this._historyService.getCrqMainByDateWithHeaders(this.fromDateFormatted, this.toDateFormatted).subscribe({
      next: (dataWithheaders) => {
        console.log(dataWithheaders);

        if (dataWithheaders.ok) {
          if (dataWithheaders.status == 200) {
            this.crqMainTableData = dataWithheaders.body;
            this.crqMainTableCount = dataWithheaders.body.length;
            // this.showOptions = true;
            this.showCrqMainTableData = true;
          } else if (dataWithheaders.status == 204) {
            this.showError("No CRQ found for this date range. Check From and To date once.");
            this.showOptions = false;
          }
        }

        // if (dataWithheaders.length == 0) {
        //   this.showError("No CRQ found for this date range. Check From and To date once.");
        //   this.showOptions = false;
        // }

      },
      error: (e) => console.error(e),
      complete: () => console.info('complete')
    })
  }

  getData(type: string) {
    console.log(type);
    this.showTable = type;
  }

  messageClear() {
    this.messageService.clear();
  }

  showSuccess(content: string) {
    this.messageService.add({ severity: 'success', summary: 'Success', sticky: true, detail: content });
  }

  showError(content: string) {
    this.messageService.add({ severity: 'error', summary: 'Error', detail: content, sticky: true });
  }

  getStatusLabel(status: string | null): string {
    if (!status) return 'In-Progress';
    return status.toUpperCase() === 'COMPLETED'
      ? 'Completed'
      : 'In-Progress';
  }

  getStatusClass(status: string | null): string {
    if (!status) return 'status-inprogress';
    return status.toUpperCase() === 'COMPLETED'
      ? 'status-completed'
      : 'status-inprogress';
  }

  parseDate(dateStr: string): number {
    if (!dateStr) return 0;

    const [datePart, timePart] = dateStr.split(' ');
    const [day, month, year] = datePart.split('-');

    return new Date(`${year}-${month}-${day}T${timePart || '00:00'}`).getTime();
  }

  goBack() {
    this.isListView = true;
    this.showCrqMainTableData = false;
    this.showOptions = false;
    this.showTable = '';
    this.crqMainTableData = this.fullCrqList;
  }

  clearFilters() {
    this.filterCrq = '';
    this.filterStatus = '';
    this.fromDate = null;
    this.toDate = null;

    this.applyFilters();  // ✅ reapply (shows full list)
  }
  refreshData() {
    this.loadAllCrqs();   // ✅ calls API again
  }
}
