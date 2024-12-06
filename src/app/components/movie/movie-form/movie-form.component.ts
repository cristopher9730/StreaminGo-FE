import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { ICasting, IGenre, IMovie } from '../../../interfaces';

@Component({
  selector: 'app-movie-form',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule
  ],
  templateUrl: './movie-form.component.html',
  styleUrls: ['./movie-form.component.scss']
})
export class MovieFormComponent implements OnChanges{
  @Input() movie: IMovie = {};
  @Input() genreList: IGenre[] = [];
  @Input() castingList: ICasting[] = [];
  @Input() action = '';
  @Output() callParentEvent: EventEmitter<IMovie> = new EventEmitter<IMovie>();
  @Output() closeModal: EventEmitter<void> = new EventEmitter<void>();

  filteredGenreList: IGenre[] = [];
  showOptionsListGenre = false;
  selectedGenreName: string = '';

  filteredCastingList: ICasting[] = [];
  showOptionsListCasting = false;
  selectedCastingName: string = '';

  callEvent(form: NgForm) {
    if (form.valid && this.movie.imageCover && this.movie.video) {
      this.callParentEvent.emit(this.movie);
      if (this.action === 'Add movie') { 
        this.resetForm(form);
      }
      this.closeModal.emit;
    } else {
      // Marcar todos los controles como tocados para mostrar mensajes de error
      Object.keys(form.controls).forEach(control => {
        form.controls[control].markAsTouched();
      });
    }
  }

  onImageUpload(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      const file = input.files[0];
      const reader = new FileReader();
      reader.onload = () => {
        this.movie.imageCover = reader.result as string;
        console.log(this.movie.imageCover); 
      };
      reader.readAsDataURL(file);
    }
  }

  onVideoUpload(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      const file = input.files[0];
      const fileName = file.name;
      const baseFileName = fileName.substring(0, fileName.lastIndexOf('.'));
      this.movie.video = baseFileName;
      console.log(this.movie.video); 
    }
  }

  validateYear(event: Event) {
    const input = event.target as HTMLInputElement;
    const value = input.value;
    if (value.length > 4) {
      input.value = value.slice(0, 4);
    }
  }

  validateDuration(event: Event) {
    const input = event.target as HTMLInputElement;
    const value = input.value;
    if (value.length > 10) {
      input.value = value.slice(0, 10);
    }
  }

  compareCasting(casting1: ICasting, casting2: ICasting): boolean {
    return casting1 && casting2 ? casting1.id === casting2.id : casting1 === casting2;
  }

  compareGenre(genre1: ICasting, genre2: ICasting): boolean {
    return genre1 && genre2 ? genre1.id === genre2.id : genre1 === genre2;
  }

  resetForm(form: NgForm) {
    form.resetForm(this.action === "Add movie");
    this.movie = {}; 
    this.movie.imageCover = '';
    this.movie.video = '';
    this.selectedGenreName = '';
    this.selectedCastingName = '';
  
    // Limpia las entradas de archivos
    const imageUploadInput = document.getElementById('imageUpload') as HTMLInputElement;
    const videoUploadInput = document.getElementById('videoUpload') as HTMLInputElement;
  
    if (imageUploadInput) {
      imageUploadInput.value = ''; 
    }
  
    if (videoUploadInput) {
      videoUploadInput.value = ''; 
    }
  }

  filterGenres(event: Event) {
    const input = (event.target as HTMLInputElement).value;
    this.filteredGenreList = this.genreList.filter(genre => 
      genre.name?.toLowerCase().includes(input.toLowerCase())
    );
  }

  filterCastings(event: Event) {
    const input = (event.target as HTMLInputElement).value;
    this.filteredCastingList = this.castingList.filter(casting => 
      casting.name?.toLowerCase().includes(input.toLowerCase())
    );
  }

  selectGenre(genre: IGenre) {
    if (genre.name) {
      this.selectedGenreName = genre.name;
    }
    this.movie.genre = genre;
    this.showOptionsListGenre = false;
  }

  selectCasting(casting: ICasting) {
    if (casting.name) {
      this.selectedCastingName = casting.name;
    }
    this.movie.casting = casting;
    this.showOptionsListCasting = false;
  }


  showOptionsGenre() {
    this.showOptionsListGenre = true;
  }

  showOptionsCasting(){
    this.showOptionsListCasting = true;
  }

  hideOptionsGenre() {
    setTimeout(() => this.showOptionsListGenre = false, 200);
  }

  hideOptionsCasting(){
    setTimeout(() => this.showOptionsListCasting = false, 200);
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['movie'] && this.movie.genre) {
      const genre = this.movie.genre;
      if (genre && genre.name) {
        this.selectedGenreName = genre.name;
      } else {
        this.selectedGenreName = '';
      }
    }
    if (changes['movie'] && this.movie.casting) {
      const casting = this.movie.casting;
      if (casting && casting.name) {
        this.selectedCastingName = casting.name;
      } else {
        this.selectedCastingName = '';
      }
    }
  }
  
}
