import { Component } from '@angular/core';
import { ChartModule } from 'primeng/chart';

@Component({
  selector: 'app-task-timeline',
  standalone: true,
  imports: [ChartModule],
  templateUrl: './tasktimeline.component.html',
  styleUrls: ['./tasktimeline.component.css']
})
export class TaskTimelineComponent {
  data: any;
  options: any;

  constructor() {
    this.data = {
      labels: ['9.00', '9.15', '9.30'],
      datasets: [
        {
          label: 'Completed',
          backgroundColor: '#4CAF50',
          data: [60, 70, 80]   // ✅ high range
        },
        {
          label: 'Pending',
          backgroundColor: '#f9d423',
          data: [30, 20, 15]   // ✅ medium range
        },
        {
          label: 'Failed',
          backgroundColor: '#f44336',
          data: [10, 10, 5]    // ✅ low range
        }
      ]
    };

    this.options = {
      responsive: true,
      plugins: {
        legend: {
          position: 'top'
        },
        title: {
          display: true,
          text: 'Team Status Distribution (%)',
          font: { size: 14, weight: 'bold' }
        }
      },
      scales: {
        x: {
          stacked: true
        },
        y: {
          stacked: true,
          beginAtZero: true,
          max: 100,
          ticks: {
            callback: (val: any) => val + '%'
          }
        }
      }
    };
  }
}
