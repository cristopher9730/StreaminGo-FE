import { Component, EventEmitter, Input, Output, inject } from '@angular/core';
import { IFeedBackMessage, IUser, IFeedbackStatus} from '../../../interfaces';
import { CommonModule } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';
import { UserService } from '../../../services/user.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-user-form',
  standalone: true,
  imports: [
    CommonModule, 
    FormsModule
  ],
  templateUrl: './user-form.component.html',
  styleUrl: './user-form.component.scss'
})
export class UserFormComponent {
  @Input() title!: string;
  @Input() user: IUser = {};
  @Input() action: string = 'add'
  service = inject(UserService);
  private snackBar = inject(MatSnackBar);
  @Output() formClosed: EventEmitter<void> = new EventEmitter<void>

  
  handleAction (form: NgForm) {
    let userToUpdate = this.user;
    delete userToUpdate.authorities;
    if (form.invalid) {
      Object.keys(form.controls).forEach(controlName => {
        form.controls[controlName].markAsTouched();
      });
      return;
    } else {
      this.service[ this.action == 'add' ? 'saveUserSignal': 'updateUserSignal'](this.user).subscribe({
        next: () => {
          this.snackBar.open('Successfully Done', 'Close', {
            horizontalPosition: 'right',
            verticalPosition: 'top',
            duration: 5 * 1000,
          });
          this.resetForm(form)
          this.formClosed.emit();
        },
        error: (error: any) => {
          this.snackBar.open('Error', 'Close', {
            horizontalPosition: 'right',
            verticalPosition: 'top',
            panelClass: ['error-snackbar']
          });
        }
      })
    }
  }
  resetForm(form: NgForm){
    form.resetForm();
  }
}