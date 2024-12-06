import { Injectable, inject, signal } from '@angular/core';
import { IMovie } from '../interfaces';
import { BaseService } from './base-service';
import { AlertService } from './alert.service';

@Injectable({
  providedIn: 'root'
})
export class MovieService extends BaseService<IMovie>{
  protected override  source: string = 'movies';
  private itemListSignal = signal<IMovie[]>([]);
  private alertService: AlertService = inject(AlertService);

  get items$ () {
    return this.itemListSignal;
  }

  public getAll() {
    this.findAll().subscribe({
      next: (response: any) => {
        response.reverse();
        this.itemListSignal.set(response);
      },
      error: (error: any) => {
        console.error('Error in get all movies request', error);
        this.alertService.error(error.error.description);
      }
    })
  }

  public save(item: IMovie) {
    item.status = 'active';
    this.add(item).subscribe({
      next: (response: any) => {
        this.itemListSignal.update((movies: IMovie[]) => [response, ...movies]);
        this.alertService.success('Movie added successfully');
      },
      error: (error: any) => {
        console.error('response', error.description);
        this.alertService.error(error.error.description);
      }
    })
  }

  public update(item: IMovie) {
    this.add(item).subscribe({
      next: () => {
        const updatedItems = this.itemListSignal().map(movie => movie.id === item.id ? item: movie);
        this.itemListSignal.set(updatedItems);
        this.alertService.success('Movie updated successfully');
      },
      error: (error: any) => {
        console.error('response', error.description);
        this.alertService.error(error.error.description);
      }
    })
  }

  public delete(item: IMovie) {
    this.del(item.id).subscribe({
      next: () => {
        this.itemListSignal.set(this.itemListSignal().filter(movie => movie.id != item.id));
        this.alertService.success('Movie deleted successfully');
      },
      error: (error: any) => {
        console.error('response', error.description);
        this.alertService.error(error.error.description);
      }
    })
  }

}