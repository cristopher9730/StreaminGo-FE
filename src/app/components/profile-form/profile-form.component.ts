import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { FormsModule, NgModel } from '@angular/forms';
import { IUser } from '../../interfaces';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ModalComponent } from '../modal/modal.component';

@Component({
  selector: 'app-profile-form',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './profile-form.component.html',
  styleUrl: './profile-form.component.scss'
})
export class ProfileFormComponent implements OnInit{

  constructor(private snackBar: MatSnackBar){

  }

  ngOnInit(): void {
    console.log(this.userPreview.id)
  }

  @Input() user: IUser =  {};
  @Input() userPreview: IUser =  {};

  @ViewChild('name') nameModel!: NgModel;
  @ViewChild('lastname') lastnameModel!: NgModel;

  @Output() callParentEvent: EventEmitter<IUser> = new EventEmitter<IUser>()

  @ViewChild('updateModal') updateModal!: ModalComponent;

  callEvent() {

    if ((this.userPreview.name === this.user.name) && (this.userPreview.lastname === this.user.lastname)) {
      this.snackBar.open('You need to change your info', 'Close', {
        horizontalPosition: 'right',
        verticalPosition: 'top',
        panelClass: ['error-snackbar']})
      return;
    }

    else if ((!this.user.name) || (!this.user.lastname)) {
      this.snackBar.open('You need to add your info', 'Close', {
        horizontalPosition: 'right',
        verticalPosition: 'top',
        panelClass: ['error-snackbar']})
      return;
    }

    else{
      this.user.id = this.userPreview.id;
      this.callParentEvent.emit(this.user);
      this.snackBar.open('You updated your info', 'Close', {
        horizontalPosition: 'right',
        verticalPosition: 'top',
        panelClass: ['success-snackbar']});

        this.updateModal.hide();
    }


  }
}