import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { IUser } from '../../interfaces';
import { CommonModule } from '@angular/common';
import { FormsModule, NgModel } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ModalComponent } from '../modal/modal.component';

@Component({
  selector: 'app-update-password',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './update-password.component.html',
  styleUrl: './update-password.component.scss'
})
export class UpdatePasswordComponent implements OnInit{
  
  public signUpError!: string;
  public validSignup = false;

  constructor(private snackBar: MatSnackBar){

  }
  
  @Input() user: IUser =  {};
  @Input() userPreview: IUser =  {};

  @Output() callParentEvent: EventEmitter<IUser> = new EventEmitter<IUser>()

  @ViewChild('password') passwordModel!: NgModel;
  @ViewChild('passwordConfirmation') passwordConfirmationModel!: NgModel;

  @ViewChild('updatePasswordModal') updatePasswordModal!: ModalComponent;
  

  ngOnInit(): void {
    console.log(this.user);
  }

  callEvent() {

    if (!this.passwordModel.valid) {
      this.passwordModel.control.markAsTouched();
      this.snackBar.open('Password must be 8-12 characters long, contain at least one number and one special character (!#$%^&*)', 'Close', {
        horizontalPosition: 'right',
        verticalPosition: 'top',
        panelClass: ['error-snackbar']
      });
      return;
    }

    else if (this.user.password !== this.user.passwordConfirmation) {
      this.passwordConfirmationModel.control.setErrors({ mismatch: true });
      this.passwordConfirmationModel.control.markAsTouched();
      this.snackBar.open('Passwords do not match', 'Close', {
        horizontalPosition: 'right',
        verticalPosition: 'top',
        panelClass: ['error-snackbar']
      });
    }
    
    else{
      this.callParentEvent.emit(this.user);
      this.snackBar.open('Password updated successfully', 'Close', {
        horizontalPosition: 'right',
        verticalPosition: 'top',
        panelClass: ['success-snackbar']
      });
      this.updatePasswordModal.hide();
    }
  }
}
