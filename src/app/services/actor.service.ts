import { inject, Injectable, signal } from '@angular/core';
import { IActor } from '../interfaces';
import { BaseService } from './base-service';
import { AlertService } from './alert.service';

@Injectable({
  providedIn: 'root'
})
export class ActorService extends BaseService<IActor>{

  protected override  source: string = 'actors';
  private itemListSignal = signal<IActor[]>([]);
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

  public save(item: IActor) {
    item.status = 'active';
    this.add(item).subscribe({
      next: (response: any) => {
        this.itemListSignal.update((actors: IActor[]) => [response, ...actors]);
        this.alertService.success('Actor added successfully');
      },
      error: (error: any) => {
        console.error('response', error.description);
        this.alertService.error(error.error.description);
      }
    })
  }

  public update(item: IActor) {
    this.add(item).subscribe({
      next: () => {
        const updatedItems = this.itemListSignal().map(actor => actor.id === item.id ? item: actor);
        this.itemListSignal.set(updatedItems);
        this.alertService.success('Actor updated successfully');
      },
      error: (error: any) => {
        console.error('response', error.description);
        this.alertService.error(error.error.description);
      }
    })
  }
  
  public delete(item: IActor) {
    this.del(item.id).subscribe({
      next: () => {
        this.itemListSignal.set(this.itemListSignal().filter(actor => actor.id != item.id));
        this.alertService.success('Actor deleted successfully');
      },
      error: (error: any) => {
        console.error('response', error.description);
        this.alertService.error(error.error.description);
      }
    })
  }
}
