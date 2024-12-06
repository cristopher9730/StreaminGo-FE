import { inject, Injectable, signal } from "@angular/core";
import { BaseService } from "./base-service";
import { IMovieDashboard } from "../interfaces";
import { LikeService } from "./like.service";

@Injectable({
    providedIn: 'root',
})
export class DashboardService extends BaseService<IMovieDashboard> {
    
    public trendingMovies: IMovieDashboard[] = [];

    private likeService = inject(LikeService);

    protected override source: string = 'movies';
    private movieListSignal = signal<IMovieDashboard[]>([]);
    snackBar: any;
    get movies$() {
        return this.movieListSignal;
    }

    getAllSignal() {
        this.findAll().subscribe({
            next: (response: any) => {
                response.reverse();
                this.movieListSignal.set(response);
            },
            error: (error: any) => {
                console.error('Error fetching movies', error);
            }
        });
    }

}