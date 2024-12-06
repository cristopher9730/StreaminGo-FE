import { MovieFormComponent } from './../movie-form/movie-form.component';
import { CommonModule } from '@angular/common';
import { Component, effect, inject, Input, OnChanges, OnInit, SimpleChanges, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ModalComponent } from '../../modal/modal.component';
import { IMovie } from '../../../interfaces';
import { MovieService } from '../../../services/movie.service';
import { GenreService } from '../../../services/genre.service';
import { CastingService } from '../../../services/casting.service';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmDialogComponent } from '../../confirm/confirm-dialog.component';

@Component({
  selector: 'app-movie-list',
  standalone: true,
  imports: [
    CommonModule, 
    FormsModule,
    ModalComponent,
    MovieFormComponent,
 
  ],
  templateUrl: './movie-list.component.html',
  styleUrl: './movie-list.component.scss'
})
export class MovieListComponent implements OnChanges, OnInit{

  @Input() itemList: IMovie[] = [];
  @Input() areActionsAvailable: boolean = false;
  private dialog = inject(MatDialog);
  public selectedItem: IMovie = {};
  public movieService: MovieService = inject(MovieService);
  public genreService: GenreService = inject(GenreService);
  public castingService: CastingService = inject(CastingService);
  @ViewChild('detailModal') detailModal!: ModalComponent; 

  ngOnInit(): void {
    this.genreService.getAll();
    this.castingService.getAll();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if(changes['areActionsAvailable']) {
      console.log('areActionsAvailable', this.areActionsAvailable);
    }
  }
  
  showDetailModal(item: IMovie, modal: any) {
    this.selectedItem = {...item}
    modal.show();
  }

  handleFormAction(item: IMovie, modal: ModalComponent) {
    this.movieService.update(item);
    modal.hide(); 
  }

  deleteMovie(item: IMovie) {
    const dialogRef = this.dialog.open(ConfirmDialogComponent);

    dialogRef.afterClosed().subscribe(result =>{
      if(result) {
        this.movieService.delete(item);
      }
    });
  }

}
