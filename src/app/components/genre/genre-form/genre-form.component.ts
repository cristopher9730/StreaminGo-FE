import { Component, EventEmitter, Input, Output } from '@angular/core';
import { IGenre } from '../../../interfaces';
import { CommonModule } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';

@Component({
  selector: 'app-genre-form',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule
  ],
  templateUrl: './genre-form.component.html',
  styleUrl: './genre-form.component.scss'
})
export class GenreFormComponent {
  @Input() genre: IGenre = {};

  @Input() action = '';
  @Output() callParentEvent: EventEmitter<IGenre> = new EventEmitter<IGenre>()
  @Output() closeModal: EventEmitter<void> = new EventEmitter<void>();

  callEvent(form: NgForm) {
    if (form.valid){
      this.callParentEvent.emit(this.genre);
      if (this.action === 'Add genre'){
        this.resetForm(form);
      }
      this.closeModal.emit;
    }
    else { (form.invalid)
      Object.keys(form.controls).forEach(controlName => {
        form.controls[controlName].markAsTouched();
      });
    }
  }

  resetForm(form: NgForm){
    form.resetForm(this.action === "Add genre");
  }
  

}
