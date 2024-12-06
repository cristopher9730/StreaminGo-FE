import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { IMovie, IMovieDashboard, IUser } from '../interfaces';

@Injectable({
  providedIn: 'root'
})
export class LikeService {

  private url = "likes";
  private user: IUser = {}


  constructor(private http: HttpClient) { }

  darLike(usuarioId?: number, peliculaId?: number): Observable<any> {
    return this.http.post(`${this.url}/user/${usuarioId}/movie/${peliculaId}`, {});
  }

  quitarLike(usuarioId?: number, peliculaId?: number): Observable<any> {
    return this.http.delete(`${this.url}/user/${usuarioId}/movie/${peliculaId}`);
  }

  verificarLike(usuarioId?: number, peliculaId?: number): Observable<boolean> {
    return this.http.get<boolean>(`${this.url}/user/${usuarioId}/movie/${peliculaId}/exists`);
  }

  obtenerNumeroDeLikes(peliculaId: number): Observable<number> {
    return this.http.get<number>(`${this.url}/count/${peliculaId}`);
  }

  getLikedMovies(userId: number): Observable<IMovie[]> {
    return this.http.get<IMovie[]>(`${this.url}/user/${userId}/movies`);
  }

  getTrendingMovies(): Observable<IMovieDashboard[]> {
    return this.http.get<IMovieDashboard[]>(`${this.url}/trending`);
  }
}
