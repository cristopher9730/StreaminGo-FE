import { Component, effect, inject } from '@angular/core';
import { UserService } from '../../../services/user.service';
import { IUser } from '../../../interfaces';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ModalComponent } from '../../modal/modal.component';
import { UserFormComponent } from '../user-from/user-form.component';
import {MatSnackBar, MatSnackBarModule} from '@angular/material/snack-bar';
import { ConfirmDialogComponent } from '../../confirm/confirm-dialog.component';
import { MatDialog } from '@angular/material/dialog';


@Component({
  selector: 'app-user-list',
  standalone: true,
  imports: [
    CommonModule, 
    FormsModule,
    ModalComponent,
    UserFormComponent,
    MatSnackBarModule
  ],
  templateUrl: './user-list.component.html',
  styleUrl: './user-list.component.scss'
})
export class UserListComponent {
  public search: string = '';
  public userList: IUser[] = [];
  private service = inject(UserService);
  private snackBar = inject(MatSnackBar);
  private dialog = inject(MatDialog);
  public currentUser: IUser = {};
  
  constructor() {
    this.service.getAllSignal();
    effect(() => {      
      this.userList = this.service.users$();
    });
  }

  applyFilter() {
    if (this.search.trim()===''){
      this.service.getAllSignal();
    }else{
      this.service.searchUsersByName(this.search).subscribe({
        next: (users) => {
          this.userList = users;
        },
        error: (error) => {
        }
      });
    }
  }


  showDetail(user: IUser, modal: any) {
    this.currentUser = {...user}; 
    modal.show();
  }

  deleteUser(user: IUser) {
    const dialogRef = this.dialog.open(ConfirmDialogComponent);

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.service.deleteUserSignal(user).subscribe({
          next: () => {
            this.snackBar.open('User deleted', 'Close', {
              horizontalPosition: 'right',
              verticalPosition: 'top',
              duration: 5 * 1000,
            });
          },
          error: (error: any) => {
            this.snackBar.open('Error deleting user', 'Close', {
              horizontalPosition: 'right',
              verticalPosition: 'top',
              panelClass: ['error-snackbar']
            });
          }
        });
      }
    });
  }
  trackById(index: number, item: IUser) {
    return item.id;
  }
}