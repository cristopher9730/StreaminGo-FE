import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { RedirectService } from '../services/redirect.service';

export const AuthGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  const authService = inject(AuthService);
  const redirectService = inject(RedirectService);

  if (authService.check()) return true;

  redirectService.setRedirectUrl(state.url);
  router.navigateByUrl('/login');
  return false;
};
