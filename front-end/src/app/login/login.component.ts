import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MessageService } from 'primeng/api';

// PrimeNG Imports
import { CardModule } from 'primeng/card';
import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';
import { ButtonModule } from 'primeng/button';
import { FloatLabelModule } from 'primeng/floatlabel';
import { LoginService } from './login.service';
import { ToastModule } from 'primeng/toast';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  standalone: true,
  providers: [MessageService],
  imports: [CommonModule, FormsModule, CardModule, FloatLabelModule, InputTextModule, PasswordModule, ButtonModule, ToastModule],
})

export class LoginComponent implements OnInit, OnDestroy {
  username: string = '';
  userEmail: string = '';
  role: string = '';
  password: string = '';
  error: string = '';
  currentYear: number = new Date().getFullYear();
  observableArr: Subscription[] = [];
  departmentName: string = '';
  constructor(private router: Router, private loginService: LoginService, private messageService: MessageService) { }

  ngOnInit(): void {
    // localStorage.clear();
    // throw new Error('Method not implemented.');
  }

  onLogin(): void {
    console.log("login cicked");

    let userDetails: any = new Object();

    userDetails.userName = this.username;
    userDetails.password = this.password;

    // this.http.post<any>(`${environment.apiUrl}/login`, {
    //   username: this.username,
    //   password: this.password,
    // }).subscribe({
    //   next: (res) => {
    //     localStorage.setItem('token', res.token);
    //     localStorage.setItem('username', this.username);
    //     localStorage.setItem('role', res.role);
    //     // this.router.navigate(['/home']);
    //     if (res.role === 'RM') {
    //       this.router.navigate(['/start-crq']);
    //     }
    //     else {
    //     this.router.navigate(['/tasklist']);
    //   }
    //   },
    //   error: () => {
    //     this.error = 'Invalid credentials. Please try again.';
    //   }
    // });

    // NEW CODES

    this.observableArr.push(this.loginService.login(userDetails).subscribe({
      next: (data) => {
        console.log("login data"+data);
        this.username = data.userName;
        this.userEmail = data.userEmail;
        // this.role = data.roles[0];
        this.departmentName = data.departmentName;
        localStorage.setItem('roles', JSON.stringify(data.roles));
        localStorage.setItem('role', data.roles[0]);
      },
      error: (e) => {
        console.error(e);
        // window.alert("invalid credentials");
        this.showError("Invalid Credentials");
      },
      complete: () => {
        console.info('complete');
        this.showSuccess("Login Successfull");
        // localStorage.setItem('userName', this.username);
        // localStorage.setItem('role', );
        // this.router.navigate(['/start-crq']);
        localStorage.setItem('userName', this.username);
        // localStorage.setItem('role', this.role);
        localStorage.setItem('userEmail', this.userEmail);
        localStorage.setItem('departmentName', this.departmentName);
        const roles = JSON.parse(localStorage.getItem('roles') || '[]');
        if (roles.includes("Deployment Manager")) {
          this.router.navigate(['/start-crq']);
        } else {
          this.router.navigate(['/tasklist']);
        }
      }
    })
    );

  }

  goToRegister(): void {
    this.router.navigate(['/register']);
  }

  shouldShowNavbar(): boolean {
    return !['/login', '/register'].includes(this.router.url);
  }

  clear() {
    this.messageService.clear();
  }

  showSuccess(content: string) {
    this.messageService.add({ severity: 'success', summary: 'Success', sticky: true, detail: content });
  }

  showError(content: string) {
    this.messageService.add({ severity: 'error', summary: 'Error', detail: content });
  }

  ngOnDestroy(): void {
    this.observableArr.forEach(observable => observable.unsubscribe);
    // console.log("subscription closed");
    // this.observableArr.forEach(s=>console.log("closed ? :"+s.closed));
  }

}