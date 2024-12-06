import { inject, Injectable, signal } from '@angular/core';
import { IGenre } from '../interfaces';
import { BaseService } from './base-service';
import { AlertService } from './alert.service';

@Injectable({
  providedIn: 'root'
})
export class GenreService extends BaseService<IGenre>{

  protected override  source: string = 'movie-genres';
  private itemListSignal = signal<IGenre[]>([]);
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
        console.error('Error in get all genres request', error);
        this.alertService.error(error.error.description);
      }
    })
  }

  public save(item: IGenre) {
    item.status = 'active';
    this.add(item).subscribe({
      next: (response: any) => {
        this.itemListSignal.update((genres: IGenre[]) => [response, ...genres]);
        this.alertService.success('Genre added successfully');
      },
      error: (error: any) => {
        console.error('response', error.description);
        this.alertService.error(error.error.description);
      }
    })
  }

  public update(item: IGenre) {
    this.add(item).subscribe({
      next: () => {
        const updatedItems = this.itemListSignal().map(genre => genre.id === item.id ? item: genre);
        this.itemListSignal.set(updatedItems);
        this.alertService.success('Genre updated successfully');
      },
      error: (error: any) => {
        console.error('response', error.description);
        this.alertService.error(error.error.description);
      }
    })
  }
  
  public delete(item: IGenre) {
    this.del(item.id).subscribe({
      next: () => {
        this.itemListSignal.set(this.itemListSignal().filter(genre => genre.id != item.id));
        this.alertService.success('Genre deleted successfully');
      },
      error: (error: any) => {
        console.error('response', error.description);
        this.alertService.error(error.error.description);
      }
    })
  }
}
