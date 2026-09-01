import { Component, signal, computed } from "@angular/core";
import { RouterModule } from "@angular/router";

import { inject } from "@angular/core";
import { rxResource } from "@angular/core/rxjs-interop";
import { CourseService } from "../../services/course.service";

import { CourseCardComponent } from "../../ui/course-card/course-card.component";
import { Course } from "../../models/course.model";

@Component({
  selector: "app-student-dashboard",
  standalone: true,
  imports: [
    RouterModule,
    CourseCardComponent,
  ],
  templateUrl: "./student-dashboard.component.html",
  styleUrl: "./student-dashboard.component.scss",
})
export class StudentDashboardComponent {
  private api = inject(CourseService);
  // signal('Liya Kebede') creates a reactive variable. Angular watches it.
  // When its value changes, Angular automatically updates the part of the
  // screen that displays it.
  studentName = signal("Liya Kebede");
  earnedCredits = signal(45);

  // computed() creates a read-only signal that derives its value from other signals.
  // It recalculates automatically whenever earnedCredits() changes—no manual refresh.
  graduationStatus = computed(() =>
    this.earnedCredits() >= 120
      ? "Eligible for Graduation"
      : "In Progress"
  );

  // A regular method. When called, it updates the earnedCredits signal.
  // The .update() method receives the current value (c) and returns the
  // new value (c + 3).
  registerForClass() {
    this.earnedCredits.update((c) => c + 3);
  }

  // signal<Course | null>(null) means: "This signal holds either a Course or nothing."
  // The | null syntax is TypeScript's way of saying a value can be absent.
  selectedCourse = signal<Course | null>(null);

  // A sample course to display (we will switch to an array in Exercise 3)
  sampleCourse: Course = {
    id: 1,
    title: "Advanced Java Services",
    code: "CSE-101",
    maxCapacity: 30,
    enrollmentCount: 12,
  };

  handleEnroll(course: Course) {
    this.selectedCourse.set(course);
    console.log("Enrollment requested for:", course.title);
  }

  // availableCourses = signal<Course[]>([
  //   {
  //     id: 1,
  //     title: "Advanced Java Services",
  //     code: "CSE-101",
  //     maxCapacity: 30,
  //     enrollmentCount: 10,
  //   },
  //   {
  //     id: 2,
  //     title: "Angular UI Lab",
  //     code: "CSE-210",
  //     maxCapacity: 25,
  //     enrollmentCount: 25,
  //   },
  //   {
  //     id: 3,
  //     title: "Database Design",
  //     code: "CSE-305",
  //     maxCapacity: 20,
  //     enrollmentCount: 18,
  //   },
  //   {
  //     id: 4,
  //     title: "API Security Workshop",
  //     code: "CSE-420",
  //     maxCapacity: 40,
  //     enrollmentCount: 15,
  //   },
  // ]);
  coursesResource = rxResource({
  stream: () => this.api.getAll(),
});
}