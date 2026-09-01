import { Injectable, inject } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { map } from "rxjs/operators";
import {
  Course,
  CourseDetail,
  PagedResponse
} from "../models/course.model";

// @Injectable() means Angular creates one instance of this service
// and shares it across the entire app.
// This is similar to AddSingleton<T>() in .NET's dependency injection.
@Injectable({
  providedIn: "root"
})
export class CourseService {

  // inject(HttpClient) requests Angular's HTTP client
  private http = inject(HttpClient);

  private baseUrl = "http://localhost:5273/api/v1/courses";

  getAll(page = 1, pageSize = 50) {

    return this.http
      .get<PagedResponse<Course>>(this.baseUrl, {
        params: {
          page: page.toString(),
          pageSize: pageSize.toString()
        },
      })
      .pipe(
        map((p) => p.items)
      );
  }

  getById(id: string) {
    return this.http.get<CourseDetail>(
      `${this.baseUrl}/${id}`
    );
  }

  // Delete a course
  delete(id: number) {
    return this.http.delete(
      `${this.baseUrl}/${id}`
    );
  }
}