import { Component, inject, Input, OnChanges, SimpleChanges } from '@angular/core';
import { IGenre } from '../../../interfaces';
import { CommonModule } from '@angular/common';
import { GenreService } from '../../../services/genre.service';
import { ModalComponent } from '../../modal/modal.component';
import { GenreFormComponent } from '../genre-form/genre-form.component';
import { ConfirmDialogComponent } from '../../confirm/confirm-dialog.component';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-genre-list',
  standalone: true,
  imports: [
    CommonModule,
    ModalComponent,
    GenreFormComponent
  ],
  templateUrl: './genre-list.component.html',
  styleUrl: './genre-list.component.scss'
})
export class GenreListComponent implements OnChanges{

  @Input() itemList: IGenre[] = [];
  @Input() areActionsAvailable: boolean = false;
  private dialog = inject(MatDialog);
  public selectedItem: IGenre = {};
  public genreService: GenreService = inject(GenreService);


  ngOnChanges(changes: SimpleChanges): void {
    if(changes['areActionsAvailable']) {
      console.log('areActionsAvailable', this.areActionsAvailable);
    }
  }
  
  showDetailModal(item: IGenre, modal: any) {
    this.selectedItem = {...item}
    modal.show();
  }

  handleFormAction(item: IGenre, modal: ModalComponent) {
    this.genreService.update(item);
    
    modal.hide();
  }

  deleteGenre(item: IGenre) {
    const dialogRef = this.dialog.open(ConfirmDialogComponent);

    dialogRef.afterClosed().subscribe(result => {
    if (result) {
      this.genreService.delete(item);
    }
  });
  }

 
}
