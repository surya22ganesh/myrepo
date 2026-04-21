import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class SmRoleGuard implements CanActivate {
  constructor(private router: Router) {}

  canActivate(): boolean {
    const role = localStorage.getItem('role');
    if (role === 'SM') {
      return true;
    } else {
      this.router.navigate(['/unauthorized']); // 401 page
      return false;
    }
  }
}
