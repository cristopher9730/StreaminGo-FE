import { Component, effect, inject } from '@angular/core';
import { DashboardService } from '../../services/dashboard.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { IMovieDashboard } from '../../interfaces';
import { MovieCardComponent } from "../../components/movie-card/movie-card.component";
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ChartComponent } from '../../components/chart/chart.component';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-search-dashboard-movies',
  standalone: true,
  imports: [RouterModule, MovieCardComponent, CommonModule, FormsModule, ChartComponent ],
  templateUrl: './search-dashboard-movies.component.html',
  styleUrl: './search-dashboard-movies.component.scss'
})
export class SearchDashboardMoviesComponent {
  public search: string = '';
  public movieList: IMovieDashboard[] = [];
  public filteredMovieList: IMovieDashboard[] = [];
  public service = inject(DashboardService);
  private snackBar = inject(MatSnackBar);

  constructor() {
    this.service.getAllSignal();
    effect(() => {      
      this.movieList = this.service.movies$();
      this.filteredMovieList = this.service.movies$();
    });
  }

  public filterMovies() {
    console.log(this.search)
    if (this.search == "") {
      this.filteredMovieList = this.movieList;
    }
    this.search = this.search.toLowerCase();
    this.filteredMovieList = this.movieList.filter(movie =>
      movie.name?.toLowerCase().includes(this.search) ||
      movie.genre?.name?.toLowerCase().includes(this.search)
    );
  }
}
