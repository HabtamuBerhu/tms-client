import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, throwError } from 'rxjs';

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  const router = inject(Router);

  return next(req).pipe(
    catchError((err: HttpErrorResponse) => {

      // Extract C# RFC 7807 ProblemDetails detail property
      const detailMessage =
        err.error?.detail ??
        'A system error occurred. Please try again.';

      if (err.status === 401) {
        // Redirect unauthenticated or expired sessions to login
        router.navigate(['/login']);
      } else {
        // Show error for developer/UI notification
        console.error('API Error Response:', detailMessage);
      }

      return throwError(() => err);
    })
  );
};