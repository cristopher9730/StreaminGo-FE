import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { ModalComponent } from '../../components/modal/modal.component';
import { MovieListComponent } from '../../components/movie/movie-list/movie-list.component';
import { MovieFormComponent } from '../../components/movie/movie-form/movie-form.component';
import { MovieService } from '../../services/movie.service';
import { ActivatedRoute } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { IMovie } from '../../interfaces';
import { LoaderComponent } from '../../components/loader/loader.component';
import { GenreService } from '../../services/genre.service';
import { CastingService } from '../../services/casting.service';

@Component({
  selector: 'app-movies',
  standalone: true,
  imports: [
    MovieListComponent,
    LoaderComponent,
    CommonModule,
    ModalComponent,
    MovieFormComponent
  ],
  templateUrl: './movies.component.html',
  styleUrl: './movies.component.scss'
})
export class MoviesComponent implements OnInit {

  public movieService: MovieService = inject(MovieService);
  public genreService: GenreService = inject(GenreService);
  public castingService: CastingService = inject(CastingService);
  public route: ActivatedRoute = inject(ActivatedRoute);
  public areActionsAvailable: boolean = false;
  public authService: AuthService =  inject(AuthService);
  public routeAuthorities: string[] =  [];

  ngOnInit(): void {
    this.movieService.getAll();
    this.genreService.getAll();
    this.castingService.getAll();
    this.route.data.subscribe( data => {
      this.routeAuthorities = data['authorities'] ? data['authorities'] : [];
      this.areActionsAvailable = this.authService.areActionsAvailable(this.routeAuthorities); 
    });
  }

  handleFormAction(item: IMovie) {
    this.movieService.save(item);
  }

}
