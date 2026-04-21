import { Router } from '@angular/router';
import { environment } from 'src/environment/enivironment';
import { Component, inject } from '@angular/core';
import { ColorPickerModule } from 'primeng/colorpicker';
import { MessageModule } from 'primeng/message';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { JsonPipe } from '@angular/common';
import { InputTextModule } from 'primeng/inputtext';
import { FormGroup, FormBuilder, FormControl, Validators, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { FloatLabel } from 'primeng/floatlabel';
import { FileUploadModule } from 'primeng/fileupload';
import { HttpClient, HttpHandler, provideHttpClient, withFetch } from '@angular/common/http';
import { AutoCompleteModule } from 'primeng/autocomplete';
import { ButtonModule } from 'primeng/button';
import { PasswordModule } from 'primeng/password';
import { ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';

interface AutoCompleteCompleteEvent {
  originalEvent: Event;
  query: string;
}

@Component({
  selector: 'app-loginv2',
  imports: [CommonModule, FormsModule, AutoCompleteModule, FileUploadModule, FloatLabel, InputTextModule, ReactiveFormsModule, ColorPickerModule, ButtonModule, MessageModule, ToastModule, PasswordModule],
  providers: [MessageService, HttpClient],
  templateUrl: './loginv2.component.html',
  styleUrl: './loginv2.component.scss'
})

export class Loginv2Component {
  loginForm: FormGroup | any;

  error: string = '';

  isLoginPage: boolean = true;

  filteredItems: any[] = [];

  items: any[] | undefined;

  username: string = '';
  password: string = '';

  // rolesArray: any[] = [
  //   { label: 'Admin', value: 'Admin' },
  //   { label: 'User', value: 'User' },
  //   { label: 'Manager', value: 'Manager' },
  //   { label: 'Guest', value: 'Guest' }
  // ];

  rolesArray: any[] = [];

  constructor(private fb: FormBuilder, private messageService: MessageService, private _http: HttpClient, private http: HttpHandler, private router: Router, private _activatedroute: ActivatedRoute) {
    // constructor(private fb: FormBuilder) {

    console.log("URL = " + this._activatedroute.snapshot.url);

    this.isLoginPage = this._activatedroute.snapshot.url[0].path === 'login';

    console.log("isLoginPage = " + this.isLoginPage);

    this.loadForm();

  }

  // onLogin(): void {

  //   console.log(this.loginForm.value);

  //   if (this.isLoginPage) {

  //     this._http.post<any>(`${environment.apiUrl}/user/isValidLogin`, this.loginForm.value).subscribe({
  //       next: (res) => {
  //         localStorage.setItem('token', res.token);
  //         localStorage.setItem('username', this.loginForm.value.username); // ✅ store username
  //         localStorage.setItem('role', res.role);

  //         switch (res.role) {
  //           case 'ROLE_USER':
  //             this.router.navigate(['/dashboard']);
  //             break;
  //         }
  //       },
  //       error: () => {
  //         this.error = 'Invalid credentials. Please try again.';
  //         this.messageService.add({ severity: 'error', summary: 'Error', detail: this.error });
  //       }
  //     });

  //   } else {
  //     console.log("in register");

  //     this._http.post<any>(`${environment.apiUrl}/user/register`, this.loginForm.value).subscribe({
  //       next: (res) => {
  //         this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Registration Successful' });
  //       },
  //       error: () => {
  //         this.error = 'Invalid credentials. Please try again.';
  //         this.messageService.add({ severity: 'error', summary: 'Error', detail: this.error });
  //       }
  //     });

  //     // this._http.post<any>(`${environment.apiUrl}/login`,this.loginForm.value).subscribe({

  //     // this._http.post<any>(`${environment.apiUrl}/isValidLogin`, this.loginForm.value).subscribe({
  //     //   next: (res) => {
  //     //     localStorage.setItem('token', res.token);
  //     //     localStorage.setItem('username', this.loginForm.value.username); // ✅ store username
  //     //     localStorage.setItem('role', res.role);

  //     //     switch (res.role) {
  //     //       case 'ROLE_USER':
  //     //         this.router.navigate(['/dashboard']);
  //     //         break;
  //     //     }

  //     //     // this.router.navigate(['/home']);

  //     //     // this.router.navigate(['/dashboard']);
  //     //   },
  //     //   error: () => {
  //     //     this.error = 'Invalid credentials. Please try again.';
  //     //     this.messageService.add({ severity: 'error', summary: 'Error', detail: this.error });
  //     //   }
  //     // });

  //   }
  // }

  goToRegister(): void {
    console.log("navigating to register");
    this.router.navigate(['/register']);  // ✅ Navigate within Angular app
  }

  goToLogin(): void {
    console.log("navigating to login");
    this.router.navigate(['/login']);  // ✅ Navigate within Angular app
  }

  loadForm(): void {

    if (this.isLoginPage) {

      this.loginForm = this.fb.group({
        username: ['', Validators.required],
        password: ['', Validators.required],
        role: ['', Validators.required],
        emailId: ['', Validators.required],
      });

    } else {

      this.loginForm = this.fb.group({
        username: ['', Validators.required],
        emailId: ['', Validators.required],
        password: ['', Validators.required],
        confirmPassword: ['', Validators.required],
        role: ['', Validators.required],
      });

    }
  }

  search(event: AutoCompleteCompleteEvent) {
    //in a real application, make a request to a remote url with the query and return filtered results, for demo we filter at client side
    // let filtered: any[] = [];
    // let query = event.query;

    // for (let i = 0; i < (this.items as any[]).length; i++) {
    //   let item = (this.items as any[])[i];
    //   if (item.label.toLowerCase().indexOf(query.toLowerCase()) == 0) {
    //     filtered.push(item);
    //   }
    // }

    this.rolesArray = ["ROLE_USER", "ROLE_ADMIN", "ROLE_APPROVER", "ROLE_BANKMANDATE", "ROLE_REVIEWER"];

    console.log(event.query);


  }

  shouldShowNavbar(): boolean {
    return !['/login', '/register'].includes(this.router.url);
  }

  onLogin(): void {

    console.log(this.loginForm.value);

    if (this.isLoginPage) {

      this._http.post<any>(`${environment.apiUrl}/login`, this.loginForm.value).subscribe({
        next: (res) => {
          localStorage.setItem('token', res.token);
          localStorage.setItem('username', this.username);
          localStorage.setItem('role', res.role);
          // this.router.navigate(['/home']);
          if (res.role === 'RM') {
            this.router.navigate(['/create-crq']);
          }
          else {
            this.router.navigate(['/tasklist']);
          }
        },
        error: () => {
          this.error = 'Invalid credentials. Please try again.';
          this.messageService.add({ severity: 'error', summary: 'Error', detail: this.error });
        }
      });

    } else {
      console.log("in register");

      this._http.post<any>(`${environment.apiUrl}/user/register`, this.loginForm.value).subscribe({
        next: (res) => {
          this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Registration Successful' });
        },
        error: () => {
          this.error = 'Invalid credentials. Please try again.';
          this.messageService.add({ severity: 'error', summary: 'Error', detail: this.error });
        }
      });

      // this._http.post<any>(`${environment.apiUrl}/login`,this.loginForm.value).subscribe({

      // this._http.post<any>(`${environment.apiUrl}/isValidLogin`, this.loginForm.value).subscribe({
      //   next: (res) => {
      //     localStorage.setItem('token', res.token);
      //     localStorage.setItem('username', this.loginForm.value.username); // ✅ store username
      //     localStorage.setItem('role', res.role);

      //     switch (res.role) {
      //       case 'ROLE_USER':
      //         this.router.navigate(['/dashboard']);
      //         break;
      //     }

      //     // this.router.navigate(['/home']);

      //     // this.router.navigate(['/dashboard']);
      //   },
      //   error: () => {
      //     this.error = 'Invalid credentials. Please try again.';
      //     this.messageService.add({ severity: 'error', summary: 'Error', detail: this.error });
      //   }
      // });

    }
  }

}
