
import { Routes } from '@angular/router';

import { AdminCourseListComponent } from './features/admin-course-list/admin-course-list';
import { roleGuard } from './guards/role.guard';
import { authGuard } from './guards/auth.guard';

export const routes: Routes = [

  // ============================================================
  // LOGIN
  // ============================================================

  {
    path: 'login',
    loadComponent: () =>
      import('./features/login/login')
        .then(m => m.Login)
  },


  // ============================================================
  // STUDENT DASHBOARD
  // ============================================================

  {
    path: 'dashboard',
    loadComponent: () =>
      import('./features/student-dashboard/student-dashboard.component')
        .then(m => m.StudentDashboardComponent)
  },


  // ============================================================
  // COURSE DETAILS
  // ============================================================

  {
    path: 'courses/:id',
    loadComponent: () =>
      import('./features/course-detail/course-detail.component')
        .then(m => m.CourseDetailComponent)
  },


  // ============================================================
  // ENROLLMENT FORM
  // ============================================================

  {
    path: 'enroll',
    loadComponent: () =>
      import('./features/enrollment-form/enrollment-form.component')
        .then(m => m.EnrollmentFormComponent)
  },


  // ============================================================
  // INSTRUCTOR DASHBOARD
  // ============================================================

  {
    path: 'instructor-dashboard',
    loadComponent: () =>
      import('./features/instructor-dashboard/instructor-dashboard')
        .then(m => m.InstructorDashboard)
  },


  // ============================================================
  // COMMAND CENTER
  // Protected by authentication guard
  // ============================================================

  {
    path: 'command-center',
    loadComponent: () =>
      import('./features/instructor-dashboard/instructor-dashboard')
        .then(m => m.InstructorDashboard),
    canActivate: [authGuard]
  },


  // ============================================================
  // ENROLLMENT LIST
  // ============================================================

  {
    path: 'enrollments',
    loadComponent: () =>
      import('./features/enrollment-list/enrollment-list.component')
        .then(m => m.EnrollmentListComponent)
  },


  // ============================================================
  // GRADE SUBMISSION
  // ============================================================

  {
    path: 'grade-submission',
    loadComponent: () =>
      import('./features/grade-submission/grade-submission.component')
        .then(m => m.GradeSubmissionComponent)
  },


  // ============================================================
  // REGISTER
  // ============================================================

  {
    path: 'register',
    loadComponent: () =>
      import('./features/register/register')
        .then(m => m.Register)
  },


  // ============================================================
  // ADMIN COURSES
  // Admin role required
  // ============================================================

  {
    path: 'admin/courses',
    component: AdminCourseListComponent,
    canActivate: [roleGuard('Admin')]
  },


  // ============================================================
  // DEFAULT ROUTE
  // ============================================================

  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full'
  },


  // ============================================================
  // UNKNOWN ROUTES
  // ============================================================

  {
    path: '**',
    redirectTo: 'login'
  }

];
