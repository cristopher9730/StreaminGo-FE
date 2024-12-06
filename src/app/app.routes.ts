import { Routes } from '@angular/router';
import { LoginComponent } from './pages/auth/login/login.component';
import { AppLayoutComponent } from './components/app-layout/app-layout.component';
import { SigUpComponent } from './pages/auth/sign-up/signup.component';
import { UsersComponent } from './pages/users/users.component';
import { AuthGuard } from './guards/auth.guard';
import { AccessDeniedComponent } from './pages/access-denied/access-denied.component';
import { AdminRoleGuard } from './guards/admin-role.guard';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { GuestGuard } from './guards/guest.guard';
import { IRole } from './interfaces';
import { MoviesComponent } from './pages/movies/movies.component';
import { GenresComponent } from './pages/genres/genres.component';
import { ActorsComponent } from './pages/actors/actors.component';
import { CastingComponent } from './pages/casting/casting.component';
import { ProfileComponent } from './pages/profile/profile.component';
import { ResetPasswordComponent } from './pages/auth/reset-password/reset-password.component';
import { StreamComponent } from './pages/stream/stream.component';
import { DashboardAdminComponent } from './pages/dashboard-admin/dashboard-admin.component';
import { SearchDashboardMoviesComponent } from './pages/search-dashboard-movies/search-dashboard-movies.component';


export const routes: Routes = [
  {
    path: 'login',
    component: LoginComponent,
    canActivate: [GuestGuard],
  },
  {
    path: 'signup',
    component: SigUpComponent,
    canActivate: [GuestGuard],
  },
  {
    path: 'resetPassword/:code',
    component: ResetPasswordComponent,
    canActivate: [GuestGuard],
  },
  {
    path: 'access-denied',
    component: AccessDeniedComponent,
  },
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full',
  },
  {
    path: 'search-dashboard-movies',
    component: SearchDashboardMoviesComponent,  
  },
  {
    path: 'stream/:video',
    component: StreamComponent,
    canActivate: [AuthGuard],
    data: { 
      authorities: [
        IRole.admin, 
        IRole.superAdmin,
        IRole.user
      ],
      name: 'Stream'
    }
  },
  {
    path: 'stream/:video/:sessionCode',
    component: StreamComponent,
    canActivate: [AuthGuard],
    data: { 
      authorities: [
        IRole.admin, 
        IRole.superAdmin,
        IRole.user
      ],
      name: 'Stream'
    }
  },
  {
    path: 'app',
    component: AppLayoutComponent,
    canActivate: [AuthGuard],
    children: [
      {
        path: 'app',
        redirectTo: 'users',
        pathMatch: 'full',
      },
      {
        path: 'users',
        component: UsersComponent,
        canActivate:[AdminRoleGuard],
        data: { 
          authorities: [
            IRole.admin, 
            IRole.superAdmin
          ],
          name: 'Management Users'
        }
      },
      {
        path: 'profile',
        component: ProfileComponent,
        data: { 
          authorities: [
            IRole.user
          ],
          name: 'profile'
        }
      },
      {
        path: 'casting',
        component: CastingComponent,
        data: { 
          authorities: [
            IRole.admin, 
            IRole.superAdmin
          ],
          showInSidebar: true,
          name: 'Casting'
        }
      },
      {
        path: 'genres',
        component: GenresComponent,
        data: { 
          authorities: [
            IRole.admin, 
            IRole.superAdmin
          ],
          showInSidebar: true,
          name: 'Genres'
        }
      },
      {
        path: 'actors',
        component: ActorsComponent,
        data: { 
          authorities: [
            IRole.admin, 
            IRole.superAdmin
          ],
          showInSidebar: true,
          name: 'Actors'
        }
      },
      {
        path: 'movies',
        component: MoviesComponent,
        data: { 
          authorities: [
            IRole.admin, 
            IRole.superAdmin
          ],
          showInSidebar: true,
          name: 'Movies'
        }
      },
      {
        path: 'dashboard-admin',
        component: DashboardAdminComponent,
        data: { 
          authorities: [
            IRole.admin, 
            IRole.superAdmin
          ],
          name: 'Dashboard'
        }
      },
      {
        path: 'dashboard',
        component: DashboardComponent,
        data: { 
          authorities: [
            IRole.admin, 
            IRole.superAdmin,
            IRole.user
          ],
          name: 'Home'
        }
      },
    ],
  },
];
