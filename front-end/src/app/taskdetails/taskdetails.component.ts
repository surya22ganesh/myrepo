import { Component, OnInit } from '@angular/core';
import { StatusCommentDTO, StatusCommentsResponse, TaskdetailsService } from './taskdetails.service';
import { FormsModule } from '@angular/forms';
import { AutoCompleteModule } from 'primeng/autocomplete';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-taskdetails',
  imports: [CommonModule, FormsModule, AutoCompleteModule,],
  templateUrl: './taskdetails.component.html',
  styleUrl: './taskdetails.component.scss'
})
export class TaskdetailsComponent implements OnInit {
  taskId: number = 0;  // Example task ID (can be dynamic)
  statusOptions: string[] = ['Assigned', 'In Progress', 'Completed', 'Delayed', 'Failed'];
  selectedStatus: string = '';
  comments: string = '';
  filteredStatuses: any[] = [];
  statuses: any[] = [
    { label: 'Assigned', value: 'Assigned' },
    { label: 'In Progress', value: 'In Progress' },
    { label: 'Delayed', value: 'Delayed' },
    { label: 'Failed', value: 'Failed' },
    { label: 'Completed', value: 'Completed' }
  ];
  responses: StatusCommentsResponse[] = [];
  isLoading = false;
  tasks: any;
  tasksId: String | any;

  LoggedInRole: String | null = "";

  constructor(private statusService: TaskdetailsService) { }

  ngOnInit(): void {

    this.LoggedInRole = (localStorage.getItem('role')) ? localStorage.getItem('role') : null;

    this.statusService.getLatestTasks().subscribe(
      (res) => {
        // this.tasks = res;
        res.filter((elem: any) => {
          console.log(elem.team.toLowerCase());
          if (this.LoggedInRole?.toLocaleLowerCase() == elem.team.toLocaleLowerCase()) {
            console.log(elem.id);
            this.taskId = elem.id;
          }
        })
        // console.log("selected ID "+ this.tasks.id)
      },
      err => { }, () => {

      });


  }


  filterStatuses(event: any) {
    const query = event.query.toLowerCase();
    this.filteredStatuses = this.statuses.filter(s =>
      s.label.toLowerCase().includes(query)
    );
  }


  onStatusSelect(selected: any) {
    console.log("✅ Selected Status:", selected);
  }

  save() {
    if (!this.selectedStatus) {
      alert('Please select a status');
      return;
    }

    const request = {
      comments: [
        {
          status: this.selectedStatus,
          comments: this.comments,
          selectTaskId: this.taskId
        } as StatusCommentDTO
      ]
    };

    this.isLoading = true;

    this.statusService.saveStatusComments(request).subscribe({
      next: (res) => {
        this.responses = res;
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error saving comments:', err);
        this.isLoading = false;
      }
    });

  }
}
