import { Injectable } from '@angular/core';
import { IAuthority, ILoginResponse, IRole, IUser } from '../interfaces';
import { Observable, of, tap } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { MatSnackBar } from '@angular/material/snack-bar';

@Injectable({
  providedIn: 'root',
})
export class AuthService{
  private accessToken!: string;
  private expiresIn!: number;
  private user: IUser = { email: '', authorities: [] };

  constructor(private http: HttpClient) {
    this.load();
  }

  public save(): void {
    if (this.user) localStorage.setItem('auth_user', JSON.stringify(this.user));

    if (this.accessToken)
      localStorage.setItem('access_token', JSON.stringify(this.accessToken));

    if (this.expiresIn)
      localStorage.setItem('expiresIn', JSON.stringify(this.expiresIn));
  }

  private load(): void {
    let token = localStorage.getItem('access_token');
    if (token) this.accessToken = token;
    let exp = localStorage.getItem('expiresIn');
    if (exp) this.expiresIn = JSON.parse(exp);
    const user = localStorage.getItem('auth_user');
    if (user) this.user = JSON.parse(user);
  }

  public getUser(): IUser | undefined {
    return this.user;
  }

  public getAccessToken(): string | null {
    return this.accessToken;
  }

  public check(): boolean {
    return !!this.accessToken; // Simplificación del método check()
  }

  public login(credentials: { email: string; password: string }): Observable<ILoginResponse> {
    return this.http.post<ILoginResponse>('auth/login', credentials).pipe(
      tap((response: any) => {
        this.accessToken = response.token;
        this.user.email = credentials.email;
        this.expiresIn = response.expiresIn;
        this.user = response.authUser;
        this.save();
      })
    );
  }

  public passwordResetRequest(credentials: {
    email: string;
  }){
    return this.http.post<IUser>('auth/passwordResetRequest', credentials).pipe();
  }

  public resetPassword(credentials: {
    password: string;
  },requestCode:string): Observable<IUser> {
    return this.http.post<IUser>('auth/passwordReset/' + requestCode, credentials).pipe();
  }

  public hasRole(role: string): boolean {
    return this.user.authorities?.some(authority => authority.authority === role) ?? false;
  }

  public hasAnyRole(roles: string[]): boolean {
    return roles.some(role => this.hasRole(role));
  }

  public getPermittedRoutes(routes: any[]): any[] {
    let permittedRoutes: any[] = [];
    for (const route of routes) {
      if (route.data && route.data.authorities) {
        if (this.hasAnyRole(route.data.authorities)) {
          permittedRoutes.unshift(route);
        }
      }
    }
    return permittedRoutes;
  }

  public signup(user: IUser): Observable<ILoginResponse> {
    // Validación de coincidencia de contraseña antes de enviar la solicitud
    if (user.password !== user.passwordConfirmation) {
      return new Observable(observer => {
        observer.error({ description: '' });
      });
    }

    // Si las contraseñas coinciden, realizar la solicitud HTTP para registrar al usuario
    return this.http.post<ILoginResponse>('auth/signup', user);
  }

  public logout(): void {
    this.accessToken = '';
    localStorage.removeItem('access_token');
    localStorage.removeItem('expiresIn');
    localStorage.removeItem('auth_user');
  }


  public getUserLogged(): Observable<IUser> {
    // Suponiendo que el usuario ya está en la memoria o en localStorage
    const user = this.getUser() ?? { email: '', authorities: [] };
    return of(user); // Devuelve un Observable que emite el usuario
  }

  public getUserAuthorities(): IAuthority[] | undefined {
    return this.getUser()?.authorities;
  }

  public areActionsAvailable(routeAuthorities: string[]): boolean  {
    // definición de las variables de validación
    let allowedUser: boolean = false;
    let isAdmin: boolean = false;
    // se obtienen los permisos del usuario
    let userAuthorities = this.getUserAuthorities();
    // se valida que sea una ruta permitida para el usuario
    for (const authority of routeAuthorities) {
      if (userAuthorities?.some(item => item.authority == authority) ) {
        allowedUser = userAuthorities?.some(item => item.authority == authority)
      }
      if (allowedUser) break;
    }
    // se valida que el usuario tenga un rol de administración
    if (userAuthorities?.some(item => item.authority == IRole.admin || item.authority == IRole.superAdmin)) {
      isAdmin = userAuthorities?.some(item => item.authority == IRole.admin || item.authority == IRole.superAdmin);
    }          
    return allowedUser && isAdmin;
  }
}