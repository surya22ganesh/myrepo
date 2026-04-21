import { HttpClient, HttpClientModule } from "@angular/common/http";
import { Component } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { CommonModule } from "@angular/common";
import { environment } from "src/environment/enivironment";


@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'],
  standalone: true,
  imports: [CommonModule, FormsModule, HttpClientModule]
})
export class RegisterComponent {
  user = {
    username: '',
    password: '',
    role: ''
  };

  roles = ['ADMIN', 'SM', 'RM', 'VCI Server Team', 'OSS L2', 'FMW', 'Siebel TA', 'VCI DBA'];

  successMessage: string = '';
  errorMessage: string = '';

  constructor(private http: HttpClient) {}

  onRegister() {
    this.http.post(`${environment.apiUrl}/register`, this.user).subscribe({
      next: () => {
        this.successMessage = '✅ Registered successfully!';
        this.errorMessage = '';
        this.user = { username: '', password: '', role: '' }; // reset form
      },
      error: (err) => {
        this.errorMessage = '❌ Registration failed: ' + (err.error?.message || 'Server error');
        this.successMessage = '';
      }
    });
  }
}
