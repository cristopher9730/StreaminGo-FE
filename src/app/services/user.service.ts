import { inject, Injectable, signal } from '@angular/core';
import { BaseService } from './base-service';
import { Observable, catchError, map, of, tap, throwError } from 'rxjs';
import { AlertService } from './alert.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { IResponse, IUser, IUserCountStats } from '../interfaces';

@Injectable({
  providedIn: 'root',
})
export class UserService extends BaseService<IUser | IUserCountStats> {
  protected override source: string = 'users';
  private userListSignal = signal<IUser[]>([]);
  private userStatsListSignal = signal<IUserCountStats[]>([]);
  private alertService: AlertService = inject(AlertService);

  get users$() {
    return this.userListSignal;
  }

  get userStats$() {
    return this.userStatsListSignal;
  }
  getAllSignal() {
    this.findAll().subscribe({
      next: (response: any) => {
        response.reverse();
        this.userListSignal.set(response);
      },
      error: (error: any) => {
        console.error('Error fetching users', error);
      }
    });
  }
  
  saveUserSignal (user: IUser): Observable<any>{
    return this.add(user).pipe(
      tap((response: any) => {
        this.userListSignal.update( users => [response, ...users]);
      }),
      catchError(error => {
        console.error('Error saving user', error);
        return throwError(error);
      })
    );
  }

  searchUsersByName(name: string): Observable<IUser[]> {
    return this.get<IUser[]>(`${this.source}/filterByName/${name}`);
  }

  public update(item: IUser) {
    this.add(item).subscribe({
      next: () => {
        const updated = this.userListSignal().map(user => user.id === item.id ? item: user);
        this.userListSignal.set(updated);
      },
      error: (error: any) => {
        console.error('response', error.description);
        this.alertService.error(error.error.description);
      }
    })
  }
  updateUserSignal (user: IUser): Observable<any>{
    return this.edit(user.id, user).pipe(
      tap((response: any) => {
        const updatedUsers = this.userListSignal().map(u => u.id === user.id ? response : u);
        this.userListSignal.set(updatedUsers);
      }),
      catchError(error => {
        console.error('Error updated user', error);
        return throwError(error);
      })
    );
  }
  deleteUserSignal (user: IUser): Observable<any>{
    return this.del(user.id).pipe(
      tap((response: any) => {
        const updatedUsers = this.userListSignal().filter(u => u.id !== user.id);
        this.userListSignal.set(updatedUsers);
      }),
      catchError(error => {
        console.error('Error deleted user', error);
        return throwError(error);
      })
    );
  }

  public chartUsersMonth(): Observable<IResponse<IUserCountStats[]>> {
    return this.http.get<IResponse<IUserCountStats[]>>(this.source + '/count-by-month');
  }

  getUserMonth() {
    this.chartUsersMonth().subscribe({
      next: (response: any) => {
        response.reverse();
        return this.userStatsListSignal.set(response);
      },
      error: (error: any) => {
        console.error('Error fetching users', error);
      }
    });
  }

  
}