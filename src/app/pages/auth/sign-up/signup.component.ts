import { CommonModule } from '@angular/common';
import { Component, ViewChild } from '@angular/core';
import { FormsModule, NgModel } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../services/auth.service';
import { IUser } from '../../../interfaces';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './signup.component.html',
  styleUrl: './signup.component.scss'
})
export class SigUpComponent {
  public signUpError!: string;
  public validSignup = false;
  public user: IUser= {
    name: '',
    email: '',
    lastname: '',
    password: '',
    passwordConfirmation: ''
  }; 

  @ViewChild('name') nameModel!: NgModel;
  @ViewChild('lastname') lastnameModel!: NgModel;
  @ViewChild('email') emailModel!: NgModel;
  @ViewChild('password') passwordModel!: NgModel;
  @ViewChild('passwordConfirmation') passwordConfirmationModel!: NgModel;;

  constructor(private router: Router, 
              private authService: AuthService,
              private snackBar: MatSnackBar
  ) {}

  handleSignup(event: Event) {
  event.preventDefault();

  // Verificar la validez de todos los campos
  if (!this.nameModel.valid) {
    this.nameModel.control.markAsTouched();
    return;
  }
  if (!this.lastnameModel.valid) {
    this.lastnameModel.control.markAsTouched();
    return;
  }
  if (!this.emailModel.valid) {
    this.emailModel.control.markAsTouched();
    return;
  }
  if (!this.passwordModel.valid) {
    this.passwordModel.control.markAsTouched();
    this.snackBar.open('Password must be 8-12 characters long, contain at least one number and one special character (!#$%^&*)', 'Close', {
      horizontalPosition: 'right',
      verticalPosition: 'top',
      panelClass: ['error-snackbar']
    });
    return;
  }

   // Verificar formato de correo electrónico
   if (this.user.email && this.emailModel.valid && this.isGmailAddress(this.user.email)) {
    this.authService.signup(this.user).subscribe({
      next: () => {
        this.snackBar.open('Signup successful!', 'Close', {
          horizontalPosition: 'right',
          verticalPosition: 'top',
          panelClass: ['success-snackbar']
        });
        this.router.navigate(['/login']);
      },
      error: (err: any) => {
        this.snackBar.open('Failed to signup', 'Close', {
          horizontalPosition: 'right',
          verticalPosition: 'top',
          panelClass: ['error-snackbar']
        });
        this.signUpError = err.description;
      }
    });
  } else {
    this.emailModel.control.markAsTouched();
  }

  // Verificar coincidencia de contraseñas
  if (this.user.password !== this.user.passwordConfirmation) {
    this.passwordConfirmationModel.control.setErrors({ mismatch: true });
    this.passwordConfirmationModel.control.markAsTouched();
    this.snackBar.open('Passwords do not match', 'Close', {
      horizontalPosition: 'right',
      verticalPosition: 'top',
      panelClass: ['error-snackbar']
    });
    return;
  }

}
private isGmailAddress(email: string): boolean {
  return /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(email);
}
}