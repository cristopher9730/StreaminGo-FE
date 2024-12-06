import { CommonModule } from '@angular/common';
import { Component, ViewChild } from '@angular/core';
import { FormsModule, NgModel } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../services/auth.service';
import { ModalComponent } from '../../../components/modal/modal.component';
import { MatSnackBar } from '@angular/material/snack-bar';
import { RedirectService } from '../../../services/redirect.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, ModalComponent],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
  public loginError!: string;
  @ViewChild('formModal') formModal: any;
  @ViewChild('email') emailModel!: NgModel;
  @ViewChild('password') passwordModel!: NgModel;
  @ViewChild('resetEmail') resetEmailModel!: NgModel;

  public loginForm: { email: string; password: string } = {
    email: '',
    password: '',
  };

  public resetForm: { email: string } = {
    email: '',
  };

  constructor(
    private router: Router, 
    private authService: AuthService,
    private snackBar: MatSnackBar,
    private redirectService: RedirectService
  ) {}

  private validateEmail(email: string): boolean {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  }

  public handleLogin(event: Event) {
    event.preventDefault();
    if (!this.emailModel.valid) {
      this.emailModel.control.markAsTouched();
    }
    if (!this.passwordModel.valid) {
      this.passwordModel.control.markAsTouched();
    }
    if (this.emailModel.valid && this.passwordModel.valid) {
      this.authService.login(this.loginForm).subscribe({
        next: () => {
        const redirectUrl = this.redirectService.getRedirectUrl();
        if (redirectUrl) {
          this.router.navigateByUrl(redirectUrl);
        } else {
          this.router.navigateByUrl('/app/dashboard');
        }
      },
        error: (err: any) => (this.loginError = err.error.description),
      });
    }
  }

  public handleReset(event: Event) {
    event.preventDefault();
    if (!this.resetEmailModel.valid && this.validateEmail(this.resetForm.email)) {
      this.resetEmailModel.control.markAsTouched();
    }

    if (this.resetEmailModel.valid) {
       this.authService.passwordResetRequest(this.resetForm).subscribe({
        next: (response: any) => {
          if (response !== null) {
            this.snackBar.open('Code sent successfully!', 'Close', {
              horizontalPosition: 'right',
              verticalPosition: 'top',
              panelClass: ['success-snackbar']
            });
            this.formModal.hide();
          } else {
            this.snackBar.open('The email is not registered', 'Close', {
              horizontalPosition: 'right',
              verticalPosition: 'top',
              panelClass: ['error-snackbar']
            });
          }
          
         
        },
        error: (err: any) => {
          this.snackBar.open('Error sending code', 'Close', {
            horizontalPosition: 'right',
            verticalPosition: 'top',
            panelClass: ['error-snackbar']
          });
          this.formModal.hide();
        }
      });
      
    }
  }
}
