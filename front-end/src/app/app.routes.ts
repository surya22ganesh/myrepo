import { Routes } from '@angular/router';

import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';

import { DevopsListComponent } from './devops/devpos-list.component';
import { SMTaskListComponent } from './sm-tasklist/sm-tasklist.component';
import { TaskListComponent } from './tasklist/tasklist.component';

import { AuthGuard } from './auth.guard';
import { DashboardComponent } from './dashboard/dashboard.component';
import { DeploymentDetailsComponent } from './deployment-details/deployment-details.component';
import { HomeComponent } from './home/home.component';
// import { CreateCrqComponent } from './create-crq/create-crq.component-new';
import { Loginv2Component } from './loginv2/loginv2.component';
import { TaskdetailsComponent } from './taskdetails/taskdetails.component';
import { RetrospectiveComponent } from './retrospective/retrospective.component';
import { CreateCrqComponent } from './create-crq/create-crq-new.component';
import { HistoryComponent } from './history/history.component';
import { CrqFormComponent } from './crq-form/crq-form.component';


export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },

  // Public routes
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },

  // Protected routes
  { path: 'home', component: HomeComponent },
  { path: 'crq-form', component: CrqFormComponent },
  { path: 'start-crq', component: CreateCrqComponent },
  { path: 'dashboard', component: DashboardComponent },
  { path: 'deployment-details', component: DeploymentDetailsComponent },
  { path: 'devops', component: DevopsListComponent },
  { path: 'sm-tasklist', component: SMTaskListComponent },
  { path: 'tasklist', component: TaskListComponent },
  { path: 'task-details', component: TaskdetailsComponent },
  { path: 'retrospective', component: RetrospectiveComponent },
  { path: 'crq-history', component: HistoryComponent },
  // Wildcard redirect
  { path: '**', redirectTo: '/login' }
];


// export const routes: Routes = [
//   { path: '', redirectTo: 'login', pathMatch: 'full' },

//   // Public routes
//   { path: 'login', component: LoginComponent },
//   // { path: 'login', component: Loginv2Component },
//   { path: 'register', component: RegisterComponent },

//   // Protected routes
//   { path: 'home', component: HomeComponent, canActivate: [AuthGuard] },
//   { path: 'start-crq', component: CreateCrqComponent, canActivate: [AuthGuard] },
//   { path: 'dashboard', component: DashboardComponent, canActivate: [AuthGuard] },
//   { path: 'deployment-details', component: DeploymentDetailsComponent, canActivate: [AuthGuard] },
//   { path: 'devops', component: DevopsListComponent, canActivate: [AuthGuard] },
//   { path: 'sm-tasklist', component: SMTaskListComponent, canActivate: [AuthGuard] },
//   { path: 'tasklist', component: TaskListComponent, canActivate: [AuthGuard] },
//   { path: 'task-details', component: TaskdetailsComponent, canActivate: [AuthGuard] },
//   { path: 'retrospective', component: RetrospectiveComponent, canActivate: [AuthGuard] },
//   // Wildcard redirect
//   { path: '**', redirectTo: '/login' }
// ];
