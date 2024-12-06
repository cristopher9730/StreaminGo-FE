import { inject, Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { BaseService } from './base-service';
import { IUser } from '../interfaces';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';
import { AlertService } from './alert.service';

@Injectable({
  providedIn: 'root'
})
export class ProfileService extends BaseService<IUser> {
  protected override source: string = 'users/me';
  private userSignal = signal<IUser>({});
  private alertService: AlertService = inject(AlertService);

  constructor(private authService: AuthService, private router: Router, private snackBar: MatSnackBar) {
    super();
  }
  

  get user$() {
    return this.userSignal;
  }

  getUserProfileInfo() {
    this.findAll().subscribe({
      next: (response: any) => {
        this.userSignal.set(response);
      }
    });
  }

  public update(user: IUser) {
    this.add(user).subscribe({
      next: (response: any) => {
        this.userSignal.update((user: IUser) => response);
        this.alertService.success('Information updated successfully');
      },
      error: (error: any) => {
        console.error('response', error.description);
        this.alertService.error(error.error.description);
      }
    });
  }

  public updatePassword(user: IUser) {
    const url = `${this.source}`;
    return this.http.put<IUser>(url, user).subscribe({
      next: (response: IUser) => {
        this.userSignal.update((user: IUser) => response);
        this.alertService.success('Password updated successfully');
      },
      error: (error: any) => {
        console.error('response', error);
        this.alertService.error(error.error.description);
      }
    });
  }

  public deleteAccount(id: number) {
    return this.http.delete(`users/${id}`).subscribe({
      next: () => {
        this.alertService.success('Account deleted successfully. Goodbye!');
        // Limpia el estado de autenticación
        this.authService.logout();

        // Redirige al usuario a la página de inicio de sesión
        this.router.navigate(['/login']);
      },
      error: (error: any) => {
        console.error('response', error);
        this.alertService.error(error.error.description);
      }
    });
  }
}
