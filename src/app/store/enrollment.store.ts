
import { computed, inject } from "@angular/core";

import {
  signalStore,
  withComputed,
  withMethods,
  patchState,
  withState,
} from "@ngrx/signals";

import {
  withEntities,
  setAllEntities,
  updateEntity,
} from "@ngrx/signals/entities";

import { rxMethod } from "@ngrx/signals/rxjs-interop";

import {
  pipe,
  concatMap,
  switchMap,
  tap,
  catchError,
  EMPTY,
} from "rxjs";

import { EnrollmentService } from "../services/enrollment.service";
import { LiveSyncService } from "../services/live-sync";
import { Enrollment } from "../models/enrollment.model";


export const EnrollmentStore = signalStore(
  { providedIn: "root" },

  // ============================================================
  // STATE
  // ============================================================

  withState({
    isLoading: false,
    error: null as string | null,
  }),

  // ============================================================
  // ENTITIES
  // ============================================================

  withEntities<Enrollment>(),

  // ============================================================
  // COMPUTED
  // ============================================================

  withComputed((store) => ({
    pendingCount: computed(
      () =>
        store
          .entities()
          .filter((e) => e.status === "Pending")
          .length
    ),
  })),

  // ============================================================
  // METHODS
  // ============================================================

  withMethods(
    (
      store,
      api = inject(EnrollmentService),
      sync = inject(LiveSyncService)
    ) => ({

      // ==========================================================
      // SIGNALR LIVE UPDATES
      // ==========================================================

      listenForLiveUpdates: rxMethod<void>(
        pipe(

          // Start SignalR connection
          tap(() => sync.connect()),

          // Listen for events
          switchMap(() => sync.events$),

          // Update matching enrollment
          tap((event) => {
            patchState(
              store,
              updateEntity({
                id: event.id,
                changes: {
                  status: event.status,
                },
              })
            );
          })
        )
      ),


      // ==========================================================
      // LOAD ENROLLMENTS
      // ==========================================================

      loadEnrollments: rxMethod<void>(
        pipe(

          tap(() =>
            patchState(store, {
              isLoading: true,
              error: null,
            })
          ),

          concatMap(() =>
            api.getAll().pipe(

              tap((rows) =>
                patchState(
                  store,
                  setAllEntities(rows),
                  {
                    isLoading: false,
                  }
                )
              ),

              catchError((err) => {

                patchState(store, {
                  isLoading: false,
                  error: err.message,
                });

                return EMPTY;
              })
            )
          )
        )
      ),


      // ==========================================================
      // OPTIMISTIC APPROVE
      // ==========================================================

      approveEnrollment: rxMethod<string>(
        pipe(

          // ------------------------------------------------------
          // Step 1: Optimistically update UI
          // ------------------------------------------------------

          tap((id) => {

            patchState(
              store,
              updateEntity({
                id,
                changes: {
                  status: "Approved",
                },
              })
            );

          }),

          // ------------------------------------------------------
          // Step 2: Send request to API
          // ------------------------------------------------------

          concatMap((id) =>

            api.approve(Number(id)).pipe(

              // --------------------------------------------------
              // Step 3: Rollback if server rejects
              // --------------------------------------------------

              catchError(() => {

                patchState(
                  store,
                  updateEntity({
                    id,
                    changes: {
                      status: "Pending",
                    },
                  })
                );

                patchState(store, {
                  error:
                    "Server rejected the approval. Check enrollment constraints.",
                });

                return EMPTY;
              })
            )
          )
        )
      ),

    })
  )
);
