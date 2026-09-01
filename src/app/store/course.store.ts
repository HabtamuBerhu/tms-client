import { inject } from '@angular/core';

import {
  signalStore,
  withMethods,
  withState,
  patchState
} from '@ngrx/signals';

import {
  withEntities,
  removeEntity,
  setAllEntities
} from '@ngrx/signals/entities';

import { catchError, EMPTY } from 'rxjs';

import { CourseService } from '../services/course.service';
import { Course } from '../models/course.model';

export const CourseStore = signalStore(

  { providedIn: 'root' },

  // Entity state
  withEntities<Course>(),

  // Additional state
  withState({
    error: ''
  }),

  withMethods((store, svc = inject(CourseService)) => ({

    deleteCourse(id: number) {

      // 1. Take snapshot before changing local state
      const previousSnapshot = store.entities();

      // 2. Remove immediately from the UI
      patchState(
        store,
        removeEntity(id)
      );

      // 3. Delete from backend
      svc.delete(id).pipe(

        catchError(err => {

          // 4. Backend rejected deletion
          // Restore previous courses
          patchState(
            store,
            setAllEntities(previousSnapshot)
          );

          // Set error message
          patchState(store, {
            error:
              'Cannot delete course: active student enrollments exist.'
          });

          return EMPTY;
        })

      ).subscribe();
    }

  }))
);