
import { inject } from '@angular/core';
import {
  CanActivateFn,
  Router
} from '@angular/router';

import { AuthService } from '../services/auth.service';

export const authGuard: CanActivateFn = () => {

  const auth = inject(AuthService);
  const router = inject(Router);

  // Check whether the user has an access token
  const token = auth.getAccessToken();

  if (token) {
    return true;
  }

  // Not authenticated → go to login
  return router.createUrlTree(['/login']);
};
