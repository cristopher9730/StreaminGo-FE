import { inject, Injectable, signal } from '@angular/core';
import { ICasting, IResponse } from '../interfaces';
import { BaseService } from './base-service';
import { AlertService } from './alert.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CastingService extends BaseService<ICasting>{

  protected override source: string = 'casting';
  private itemListSignal = signal<ICasting[]>([]);
  private alertService: AlertService = inject(AlertService);
  
  get items$ () {
    return this.itemListSignal;
  }

  public addActorsToCasting(id: any | undefined, data:[]): Observable<IResponse<ICasting>> {
    return this.http.put<IResponse<ICasting>>(this.source + '/' + id + '/actors', data);
  }

  public getAll() {
    this.findAll().subscribe({
      next: (response: any) => {
        response.reverse();
        this.itemListSignal.set(response);
      },
      error: (error: any) => {
        console.error('Error in get all casting request', error);
        this.alertService.error(error.error.description);
      }
    })
  }

  public save(item: ICasting,actor : []) {
    item.status = 'active';
    this.add(item).subscribe({
      next: (response: any) => {
        this.itemListSignal.update((casting: ICasting[]) => [response, ...casting]);
        this.addActors(response.id, actor);
        this.alertService.success('Casting added successfully');
      },

      error: (error: any) => {
        console.error('response', error.description);
        this.alertService.error(error.error.description);
      }
    })
  }

  public update(item: ICasting) {
    this.edit(item.id,item).subscribe({
      next: () => {
        const updatedItems = this.itemListSignal().map(casting => casting.id === item.id ? item: casting);
        this.itemListSignal.set(updatedItems);
        this.alertService.success('Casting updated successfully');
      },
      error: (error: any) => {
        console.error('response', error.description);
        this.alertService.error(error.error.description);
      }
    })
  }

  public addActors(item : number,actor : []) {
    this.addActorsToCasting(item, actor).subscribe({
      next: (response) => {
      const updatedCasting = response.data;
      
      const updatedItems = this.itemListSignal().map(casting =>
        casting.id === item ? updatedCasting : casting
      );

      },
      error: (error: any) => {
        console.error('response', error.description);
        this.alertService.error(error.error.description);
      }
    })
  }
  
  public delete(item: ICasting) {
    this.del(item.id).subscribe({
      next: () => {
        this.itemListSignal.set(this.itemListSignal().filter(casting => casting.id != item.id));
        this.alertService.success('Casting deleted successfully');
      },
      error: (error: any) => {
        console.error('response', error.description);
        this.alertService.error(error.error.description);
      }
    })
  }
}
