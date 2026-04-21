import { CommonModule } from "@angular/common";
import { Component } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { NavigationEnd, Router, RouterLink, RouterModule, RouterOutlet } from '@angular/router';
import { Dialog, DialogModule } from 'primeng/dialog';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { TableModule } from "primeng/table";
import { AiServiceService } from './services/ai-service.service'

interface Column {
  field: string;
  header: string;
}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  standalone: true,
  imports: [RouterLink, CommonModule, RouterOutlet, RouterModule, ButtonModule, DialogModule, TableModule]
})
export class AppComponent {
  title = 'APPOS Application';
  username: string = '';
  role: string = '';
  roles: string[] = [];
  currentYear: number = new Date().getFullYear();

  // predictResp!: Product[];
  predictResp!: any;

  cols!: Column[];
  showRecords: boolean = false;

  constructor(public router: Router, private _aiService: AiServiceService) { }

  ngOnInit(): void {

    // this.predictResp = [
    //   {
    //     "step": "Server Team to do the system health check for all the servers",
    //     "prone_to_issues": true,
    //     "severity": "Medium",
    //     "resolution": "Rerunning the script after correcting permissions.",
    //     "root_cause": "Incorrect file permissions on the health check script."
    //   },
    //   {
    //     "step": "Ensure all monitoring agents, script, cronjobs are resumed including Dynatrace, AppDynamics",
    //     "prone_to_issues": true,
    //     "severity": "Medium",
    //     "resolution": "Manual restart of the Dynatrace agent.",
    //     "root_cause": "Agent process hung due to a memory leak."
    //   }
    // ];

    // this._aiService.predict(["1","2"]).subscribe((data) => {
    //   this.predictResp = data.insights;
    // });

    // this.cols = [
    //   { field: 'step', header: 'Step' },
    //   { field: 'prone_to_issues', header: 'Prone To Issues' },
    //   { field: 'severity', header: 'Severity' },
    //   { field: 'resolution', header: 'Resolution' },
    //   { field: 'root_cause', header: 'Root Cause' }
    // ];

    this.loadUsername();


    // ✅ Update username on every route change
    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        this.loadUsername();
      }
    });
  }


  loadUsername() {
    const storedUsername = localStorage.getItem('userName');
    const storedRole = localStorage.getItem('role');
    const storedRoles = localStorage.getItem('roles');
    this.roles = storedRoles ? JSON.parse(storedRoles) : [];
    this.username = storedUsername || '';
    this.role = storedRole || '';
  }

  shouldShowNavbar(): boolean {
    return !['/login', '/register'].includes(this.router.url);
  }
  logout(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('userName');
    localStorage.removeItem('userEmail');
    localStorage.removeItem('role');
    this.router.navigate(['/login']);
  }

  toggleRecords() {
    this.showRecords = !this.showRecords;
  }
  // // AI Response dialog codes

  // visible: boolean = false;

  // position: 'left' | 'right' | 'top' | 'bottom' | 'center' | 'topleft' | 'topright' | 'bottomleft' | 'bottomright' = 'center';

  // showAIresponse(position: 'left' | 'right' | 'top' | 'bottom' | 'center' | 'topleft' | 'topright' | 'bottomleft' | 'bottomright') {
  //   this.position = position;
  //   this.visible = true;
  // }

}
