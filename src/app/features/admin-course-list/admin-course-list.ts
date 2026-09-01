
import {
  Component,
  OnInit,
  inject,
  signal,
  computed
} from '@angular/core';

import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth.service';

interface Course {
  id: number;
  code: string;
  name: string;
  description: string;
  credits: number;
}

@Component({
  selector: 'app-admin-course-list',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './admin-course-list.html',
  styleUrl: './admin-course-list.scss'
})
export class AdminCourseListComponent implements OnInit {

  // =====================================================
  // AUTH SERVICE
  // =====================================================

  auth = inject(AuthService);


  // =====================================================
  // COURSES
  // =====================================================

  courses = signal<Course[]>([
    {
      id: 1,
      code: 'MAT-101',
      name: 'Mathematics I',
      description:
        'Introduction to fundamental mathematical concepts.',
      credits: 3
    },
    {
      id: 2,
      code: 'CS-101',
      name: 'Introduction to Computer Science',
      description:
        'Fundamentals of computer science and programming.',
      credits: 3
    },
    {
      id: 3,
      code: 'CS-201',
      name: 'Data Structures',
      description:
        'Study of data structures and algorithms.',
      credits: 3
    }
  ]);


  // =====================================================
  // SEARCH
  // =====================================================

  searchTerm = signal('');


  filteredCourses = computed(() => {

    const search =
      this.searchTerm()
        .toLowerCase()
        .trim();

    if (!search) {
      return this.courses();
    }

    return this.courses().filter(course =>
      course.code
        .toLowerCase()
        .includes(search) ||

      course.name
        .toLowerCase()
        .includes(search) ||

      course.description
        .toLowerCase()
        .includes(search)
    );

  });


  // =====================================================
  // INITIALIZATION
  // =====================================================

  ngOnInit(): void {

    // Course loading from your .NET API
    // can be added here.

  }


  // =====================================================
  // SEARCH
  // =====================================================

  onSearch(event: Event): void {

    const input =
      event.target as HTMLInputElement;

    this.searchTerm.set(input.value);

  }


  // =====================================================
  // ADD COURSE
  // =====================================================

  addCourse(): void {

    console.log('Add course clicked');

  }


  // =====================================================
  // EDIT COURSE
  // =====================================================

  editCourse(course: Course): void {

    console.log('Edit course:', course);

  }


  // =====================================================
  // DELETE COURSE
  // =====================================================

  deleteCourse(courseId: number): void {

    const course =
      this.courses().find(
        c => c.id === courseId
      );

    if (!course) {
      return;
    }

    const confirmed =
      confirm(
        `Are you sure you want to delete ${course.code} - ${course.name}?`
      );

    if (!confirmed) {
      return;
    }

    this.courses.update(courses =>
      courses.filter(
        c => c.id !== courseId
      )
    );

  }

}
