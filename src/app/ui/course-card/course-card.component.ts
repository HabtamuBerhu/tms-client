
import { Component, input, output } from "@angular/core";
import { RouterModule } from "@angular/router";
import { Course } from "../../models/course.model";

@Component({
  selector: "tms-course-card",
  standalone: true,
  imports: [RouterModule],
  templateUrl: "./course-card.component.html",
  styleUrl: "./course-card.component.scss",
})
export class CourseCardComponent {
  // Required signal-based input
  course = input.required<Course>();

  // Output event for enrollment
  enrollClicked = output<Course>();
}
