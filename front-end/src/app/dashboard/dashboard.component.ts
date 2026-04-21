import { AfterViewInit, Component, OnDestroy, OnInit, PLATFORM_ID, ChangeDetectorRef, inject, effect } from '@angular/core';
import { DashboardService } from './dashboard.service';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { Router, RouterLink } from '@angular/router';
import { ChartModule } from 'primeng/chart';
import { AppConfigService } from '../services/appconfig.service';
import { DesignerService } from '../services/designer.service';

interface DeploymentCategory {
  name: string;
  value: number;
  applications: string[];
  status: string;
  color: string;
}

@Component({
  selector: 'app-dashboard',
  imports: [CommonModule, ButtonModule, RouterLink, ChartModule],
  standalone: true,
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
})
export class DashboardComponent implements OnInit, OnDestroy, AfterViewInit {


  // DONUGHT CHART CODES
  overallPercentageChartData: any;

  options: any;

  platformId = inject(PLATFORM_ID);

  configService = inject(AppConfigService);

  designerService = inject(DesignerService);

  filteredTasks: any[] = [];

  crqNumber: string | any;

  percentData: any;

  overallPercentageChartOptions: any;

  data: any;

  crqReleaseNumber: string | any = "";

  activeCard: string = '';

  showCharts: boolean = false;


  lastUpdated: Date = new Date();
  currentTime: Date = new Date();

  themeEffect = effect(() => {
    if (this.configService.transitionComplete()) {
      if (this.designerService.preset()) {
        this.initChart();
      }
    }
  });
  onCardClick(type: string) {

    // Trigger animation
    this.activeCard = '';
    setTimeout(() => {
      this.activeCard = type;
    }, 10);

    // Do filtering
    this.filterContent(type);
  }
  initChart() {

    if (isPlatformBrowser(this.platformId)) {
      const documentStyle = getComputedStyle(document.documentElement);
      const textColor = documentStyle.getPropertyValue('--p-text-color');

      this.overallPercentageChartData = {
        labels: [
          'Tasks Completed',
          'Tasks Pending'
        ],
        datasets: [
          {
            // ✅ Corrected data
            // data: [this.percentData, (100 - this.percentData)],
            data: [
              this.completedCount,
              this.totalTasksCount - this.completedCount
            ],
            backgroundColor: [
              documentStyle.getPropertyValue('--p-green-500'),
              documentStyle.getPropertyValue('--p-surface-400')
            ],
            hoverBackgroundColor: [
              documentStyle.getPropertyValue('--p-green-400'),
              documentStyle.getPropertyValue('--p-surface-300')
            ]
          }
        ]
      };

      this.overallPercentageChartOptions = {
        cutout: '60%',
        plugins: {
          // tooltip: {
          //   callbacks: {
          //     label: (context: any) => {
          //       const label = context.label;
          //       const value = context.raw;

          //       // return `  ${value.toFixed(1)}%`;
          //       return `  ${Math.round(value)}%`;
          //     }
          //   }
          // tooltip: {
          //   callbacks: {
          //     label: (context: any) => {
          //       const dataset = context.dataset.data;
          //       const total = dataset.reduce((a: number, b: number) => a + b, 0);
          //       const value = context.raw;

          //       const percentage = total === 0
          //         ? 0
          //         : Math.round((value / total) * 100);

          //       return ` ${percentage}%`;
          //     }
          //   }

          // },
          tooltip: {
            callbacks: {
              label: (context: any) => {

                const dataset = context.dataset.data;

                const total = dataset.reduce(
                  (a: number, b: number) => a + Number(b),
                  0
                );

                if (total === 0) return ' 0%';

                // Step 1: Calculate rounded percentages
                const percentages = dataset.map((val: number) =>
                  Math.round((Number(val) / total) * 100)
                );

                // Step 2: Fix rounding difference
                const sum = percentages.reduce(
                  (a: number, b: number) => a + b,
                  0
                );

                if (sum !== 100) {
                  const diff = 100 - sum;
                  percentages[percentages.length - 1] += diff;
                }

                return ` ${percentages[context.dataIndex]}%`;
              }
            }
          },
          legend: {
            position: 'top',
            labels: {
              color: textColor,
              font: {
                size: 13
              },
              padding: 20
            }
          }
        }
      };
    }
  }


  initChart2() {

    let green = 0;
    let red = 0;
    let amber = 0;
    let activeJobs = 0;
    let notStarted = 0;

    this.totalTasks.forEach((task: any) => {

      const status = (task.status || '').toLowerCase().trim();
      const rag = (task.rag || '').toLowerCase().trim();

      if (status === 'completed') {

        if (rag === 'green') green++;
        else if (rag === 'red') red++;
        else if (rag === 'amber') amber++;
        else green++;

      } else if (
        status === 'assigned' ||
        status === 'in progress' ||
        status === 'inprogress'
      ) {

        activeJobs++;

      } else {

        notStarted++;
      }
    });

    const actualTotal = this.totalTasks.length;
    const chartTotal = green + red + amber + activeJobs + notStarted;

    // Safety correction (prevents 101% issue)
    if (chartTotal !== actualTotal) {
      notStarted = actualTotal - (green + red + amber + activeJobs);
    }
    const total = green + red + amber + activeJobs + notStarted;

    this.completedOnTimePercent =
      total === 0
        ? 0
        : Math.round((green / total) * 100);

    console.log('Total:', actualTotal, 'Chart:', green + red + amber + activeJobs + notStarted);

    if (isPlatformBrowser(this.platformId)) {

      const documentStyle = getComputedStyle(document.documentElement);
      const textColor = documentStyle.getPropertyValue('--p-text-color');

      this.data = {
        labels: [
          'Completed On Time',
          'Completed With Issues',
          'Completed With Delay',
          'Not Yet Started',
          'Active Jobs'
        ],
        datasets: [
          {
            data: [green, red, amber, notStarted, activeJobs],
            backgroundColor: [
              documentStyle.getPropertyValue('--p-green-500'),
              documentStyle.getPropertyValue('--p-red-500'),
              documentStyle.getPropertyValue('--p-orange-500'),
              documentStyle.getPropertyValue('--p-surface-400'),
              documentStyle.getPropertyValue('--p-blue-400')
            ],
            hoverBackgroundColor: [
              documentStyle.getPropertyValue('--p-green-400'),
              documentStyle.getPropertyValue('--p-red-400'),
              documentStyle.getPropertyValue('--p-orange-400'),
              documentStyle.getPropertyValue('--p-surface-300'),
              documentStyle.getPropertyValue('--p-blue-300')
            ]
          }
        ]
      };

      this.options = {
        cutout: '60%',
        plugins: {
          legend: {
            labels: {
              color: textColor,
              font: { size: 12 }
            }
          },
          tooltip: {
            callbacks: {
              label: (context: any) => {

                const dataset = context.dataset.data;

                const total = dataset.reduce(
                  (acc: number, curr: number) => acc + Number(curr),
                  0
                );

                const value = Number(context.raw) || 0;

                const percentage =
                  total === 0
                    ? 0
                    : ((value / total) * 100).toFixed(1);

                return ` ${percentage}%`;
              }
            }
          }
        }
      };
    }
  }

  chartFun(event: any) {
    console.log("chart called" + event);

    const datasetIndex = event.element.datasetIndex;

    // index of the slice that was clicked
    const dataIndex = event.element.index;

    // get the label from your chart data
    const label = this.data.labels[dataIndex];

    console.log('Clicked slice:', label);

    if (label.includes('Delay') || label.includes('Issues')) this._router.navigate(['/retrospective']);

    // Example: show an alert
    // alert(`You clicked on: ${label}`);

    // this.filterContent(label);


  }

  // ends

  // filtering codes

  filterContent(state: String) {
    console.log(state);
    console.log(this.totalTasks);
    switch (state) {
      case "completed":
        this.filteredTasks = this.totalTasks.filter(elem => elem.status?.toLowerCase() == "completed");
        break;
      case "progress":
        this.filteredTasks = this.totalTasks.filter(elem => elem.status?.toLowerCase() == "in progress");
        break;
      case "failed":
        this.filteredTasks = this.totalTasks.filter(elem => elem.status?.toLowerCase() == "failed");
        break;
      case "delayed":
        this.filteredTasks = this.totalTasks.filter(elem => elem.status?.toLowerCase() == "delayed");
        break;
      case "assigned":
        this.filteredTasks = this.totalTasks.filter(elem => elem.status?.toLowerCase() === "assigned");
        break;
      case "unassigned":
        this.filteredTasks = this.totalTasks.filter(elem => elem.status?.toLowerCase() === "unassigned");
        break;
      case "total":
        this.filteredTasks = this.totalTasks;
        break;
      default:
        break;
    }
  }

  // ends
  totalTasksCount: number = 0; // keep from seRouterLink,parate API
  completedCount: number = 0;
  inProgressCount: number = 0;
  failedCount: number = 0;
  delayedCount: number = 0;
  assignedCount: number = 0;
  unassignedCount: number = 0;

  completedOnTimePercent: number = 0;
  completedPercent: number = 0;
  inProgressPercent: number = 0;
  failedPercent: number = 0;
  delayedPercent: number = 0;

  totalTasks: any[] = [];
  public cd: any;

  // constructor(private _dashboardService: DashboardService, private cd: ChangeDetectorRef) { }
  constructor(private _dashboardService: DashboardService, private _router: Router) {
    this.cd = inject(ChangeDetectorRef);
  }

  ngOnInit() {

    this.crqNumber = localStorage.getItem('crqRef');
    this.crqReleaseNumber = localStorage.getItem('crqReleaseNum');

    this.loadActiveTasks();      // fetch totalTasksCount
    // this.calculatePercentage(); // calculate percentages
    // this.initChart();

    this.chartData = {
      labels: this.deploymentData.map(d => d.name),
      datasets: [
        {
          data: this.deploymentData.map(d => d.value),
          backgroundColor: this.deploymentData.map(d => d.color),
          borderWidth: 2
        }
      ]
    };

    this.chartOptions = {
      cutout: '70%',
      plugins: {
        legend: {
          position: 'bottom',
          labels: {
            usePointStyle: true,
            font: { size: 12 }
          }
        }
      }
    };
    setInterval(() => {
      this.currentTime = new Date();
    }, 60000);

  }

  ngAfterViewInit(): void {

    this._dashboardService.getAllTasks(this.crqNumber).subscribe((data: any) => {
      this.totalTasks = data;
      this.filteredTasks = data;
      // this.crqNumber = data[0].crqTicket;
      // console.log(`crq ticket - :  ${data[0].crqTicket}`);
      // window.alert(`crq ticket - :  ${data[0].crqTicket}`);
      console.log("Total tasks count:", this.totalTasksCount);
    },
      (err: any) => console.error("Error fetching active tasks:", err)
      , () => { });

    console.warn("AfterViewInit - Total Tasks:", this.totalTasks);
  }

  loadActiveTasks() {
    this._dashboardService.getAllTasks(this.crqNumber).subscribe((data: any) => {
      this.totalTasksCount = data.length;
      this.totalTasks = data;
      data.forEach((task: any) => {
        switch (task.status) {
          case 'Completed':
            this.completedCount++;
            break;
          case 'In Progress':
            this.inProgressCount++;
            break;
          case 'Failed':
            this.failedCount++;
            break;
          case 'Delayed':
            this.delayedCount++;
            break;
          case 'Assigned':
            this.assignedCount++;
            break;
          case 'Unassigned':           // if you have such a status
            this.unassignedCount++;
            break;
          default:
            break;
        }
      });
      console.log("Total tasks count:", this.totalTasksCount);

    },
      (err: any) => console.error("Error fetching active tasks:", err)
      , () => {
        this.calculatePercentage();
      });
  }

  calculatePercentage(): void {

    console.log("Calculating percentages...");
    console.log(this.totalTasksCount);
    console.log(this.completedCount);
    console.log(this.inProgressCount);
    console.log(this.failedCount);
    console.log(this.delayedCount);

    // Calculate percentages based on totalTasksCount (from separate API)
    this.completedPercent = this.totalTasksCount ? (this.completedCount / this.totalTasksCount) * 100 : 0;
    this.inProgressPercent = this.totalTasksCount ? (this.inProgressCount / this.totalTasksCount) * 100 : 0;
    this.failedPercent = this.totalTasksCount ? (this.failedCount / this.totalTasksCount) * 100 : 0;
    this.delayedPercent = this.totalTasksCount ? (this.delayedCount / this.totalTasksCount) * 100 : 0;
    console.log("Counts:", this.completedCount, this.inProgressCount, this.failedCount, this.delayedCount);
    console.log("Percentages:", this.completedPercent, this.inProgressPercent, this.failedPercent, this.delayedPercent);

    // calling chart

    console.log("sum" + this.inProgressCount + this.failedCount + this.delayedCount + this.completedCount);

    console.log("completed count " + this.completedCount);

    console.log("percentage " + ((this.completedCount / this.totalTasksCount) * 100));

    this.percentData = Math.floor(((this.completedCount / this.totalTasksCount) * 100));

    this.initChart();
    this.initChart2();

    this.showCharts = true;

    // return (this.inProgressCount + this.failedCount + this.delayedCount + this.completedCount + this.assignedCount) > 0;

  }

  ngOnDestroy(): void {
    // Cleanup if needed
    this.totalTasksCount = 0;
    this.completedCount = 0;
    this.inProgressCount = 0;
    this.failedCount = 0;
    this.delayedCount = 0;
    this.assignedCount = 0;
    this.unassignedCount = 0;
  }

  overallPercentage() {

  }

  // deployment chart

  deploymentData: DeploymentCategory[] = [
    {
      name: 'NewCo Technical Deployment',
      value: 9,
      applications: ['Siebel Core', 'Siebel Catalogue', 'FMW', 'BRM', 'OAP', 'OSM', 'ASAP', 'UIM', 'WCC'],
      status: 'Ongoing',
      color: '#FF6B6B'
    },
    {
      name: 'Non-NewCo Technical Deployment',
      value: 6,
      applications: ['eCare', 'Online Catalogue', 'TIL', 'MFT', 'CMT', 'Surepay'],
      status: 'Mixed',
      color: '#4ECDC4'
    },
    {
      name: 'Pre-DVT Activities',
      value: 2,
      applications: ['MVA/MVAX, VOXI, eCare, Digital, TOBi', 'CC, Retail'],
      status: 'Scheduled',
      color: '#45B7D1'
    },
    {
      name: 'DVT & Testing',
      value: 1,
      applications: ['Full DVT (CC, Retail, MVA, DigitalX, VOXI, TOBI, Online & Billing)'],
      status: 'Scheduled',
      color: '#96CEB4'
    },
    {
      name: 'Operational Activities',
      value: 7,
      applications: ['Contingency Setup', 'Monitoring', 'Queue Management', 'Channel Ramp Up', 'Post DVT', 'BAU Monitoring', 'LECO Unpause'],
      status: 'Mixed',
      color: '#FFEAA7'
    }
  ];

  chartData: any;
  chartOptions: any;

  get timeAgo(): string {
    const diffMs = this.currentTime.getTime() - this.lastUpdated.getTime();
    const diffMins = Math.floor(diffMs / 60000);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins} minute${diffMins > 1 ? 's' : ''} ago`;
    const diffHrs = Math.floor(diffMins / 60);
    if (diffHrs < 24) return `${diffHrs} hour${diffHrs > 1 ? 's' : ''} ago`;
    const diffDays = Math.floor(diffHrs / 24);
    return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
  }

}
