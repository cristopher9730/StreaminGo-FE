import { Component, QueryList, ViewChildren, ElementRef, inject, effect, OnInit } from '@angular/core';
import Swiper from 'swiper';
import { EffectCoverflow, Navigation, Pagination } from 'swiper/modules';
import { MovieCardComponent } from '../../components/movie-card/movie-card.component';
import { DashboardService } from '../../services/dashboard.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { IMovieDashboard } from '../../interfaces';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ChartComponent } from '../../components/chart/chart.component';
import { provideEcharts } from 'ngx-echarts';
import { RouterModule } from '@angular/router';
import { LikeService } from '../../services/like.service';

// Registra los módulos de Swiper
Swiper.use([EffectCoverflow, Navigation, Pagination]);

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    RouterModule,
    MovieCardComponent,
    CommonModule,
    FormsModule,
    ChartComponent,
  ],
  providers: [provideEcharts()],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  public search: string = '';
  public movieList: IMovieDashboard[] = [];
  public filteredMovieList: IMovieDashboard[] = [];
  public trendingMovies: IMovieDashboard[] = [];
  private service = inject(DashboardService);
  private likeService = inject(LikeService);
  private snackBar = inject(MatSnackBar);

  videoSrc: string = '';
  videoId: string = '';
  player: any | undefined;

  @ViewChildren('playOnHover') playOnHoverElements!: QueryList<ElementRef<HTMLVideoElement>>;
  @ViewChildren('swiperContainer') swiperContainer!: QueryList<ElementRef>;

  constructor() {
    this.service.getAllSignal();

    effect(() => {      
      this.movieList = this.service.movies$();
      this.filteredMovieList = this.getRandomMovies(this.movieList, 5);
    });
  }

  ngOnInit(): void {
    this.loadTrendingMovies();
  }

  private getRandomMovies(movies: IMovieDashboard[], max: number): IMovieDashboard[] {
    const shuffled = [...movies].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, max);
  }

  loadTrendingMovies() {
    this.likeService.getTrendingMovies().subscribe({
      next: (movies) => {
        movies.reverse();
        this.trendingMovies = movies;
      },
      error: () => {
        this.snackBar.open('Error al cargar las películas trending.', 'Cerrar', { duration: 3000 });
      }
    });
   
  }

  playVideo(activeIndex: number) {
    this.playOnHoverElements.forEach((videoRef, index) => {
      if (index === activeIndex) {
        videoRef.nativeElement.play();
      }else{
        videoRef.nativeElement.pause();
      }
    });
  }

  pauseAll(activeIndex: number) {
    this.playOnHoverElements.forEach((videoRef, index) => {
      
        videoRef.nativeElement.pause();
      
    });
  }

}
