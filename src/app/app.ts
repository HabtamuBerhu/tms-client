
// import { Component } from '@angular/core';
// import { RouterOutlet } from '@angular/router';

// @Component({
//   selector: 'app-root',
//   imports: [RouterOutlet],
//   templateUrl: './app.html',
//   styleUrl: './app.scss'
// })
// export class App {}



// import { Component, inject } from '@angular/core';
// import { Router, RouterOutlet } from '@angular/router';
// import { Navigation } from './features/navigation/navigation';

// @Component({
//   selector: 'app-root',
//   standalone: true,
//   imports: [
//     RouterOutlet,
//     Navigation
//   ],
//   templateUrl: './app.html',
//   styleUrl: './app.scss'
// })
// export class App {

//   private readonly router = inject(Router);

//   showNavigation(): boolean {

//     const url = this.router.url;

//     return !url.startsWith('/login')
//       && !url.startsWith('/register');
//   }
// }









// import { Component, inject, signal } from '@angular/core';
// import { RouterOutlet } from '@angular/router';

// import { EnrollmentStore } from './store/enrollment.store';
// import { Login } from './features/login/login';

// @Component({
//   selector: 'app-root',
//   imports: [
//     RouterOutlet,
//     Login
//   ],
//   templateUrl: './app.html',
//   styleUrl: './app.scss'
// })
// export class App {

//   private store = inject(EnrollmentStore);

//   protected readonly title = signal('tms-client');

//   constructor() {
//     this.store.loadEnrollments();
//     this.store.listenForLiveUpdates();
//   }
// }


import {
  Component,
  inject,
  signal
} from '@angular/core';

import {
  Router,
  RouterOutlet
} from '@angular/router';

import { EnrollmentStore } from './store/enrollment.store';
import { Navigation } from './features/navigation/navigation';

@Component({
  selector: 'app-root',

  standalone: true,

  imports: [
    RouterOutlet,
     Navigation
  ],

  templateUrl: './app.html',

  styleUrl: './app.scss'
})
export class App {

  // =====================================================
  // SERVICES
  // =====================================================

  private readonly router = inject(Router);

  private readonly store =
    inject(EnrollmentStore);


  // =====================================================
  // APP TITLE
  // =====================================================

  protected readonly title =
    signal('tms-client');


  // =====================================================
  // CONSTRUCTOR
  // =====================================================

  constructor() {

    this.store.loadEnrollments();

    this.store.listenForLiveUpdates();

  }


  // =====================================================
  // NAVIGATION VISIBILITY
  // =====================================================

  showNavigation(): boolean {

    const url = this.router.url;

    return !url.startsWith('/login')
      && !url.startsWith('/register');

  }

}