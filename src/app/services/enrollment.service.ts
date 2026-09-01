
import { Injectable, inject } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";
import { Enrollment, PagedResponse } from "../models/enrollment.model";
import { map } from "rxjs/operators";

@Injectable({
  providedIn: "root",
})
export class EnrollmentService {

  private http = inject(HttpClient);

  private baseUrl =
    "http://localhost:5273/api/v1/enrollments";

  getAll(
    page = 1,
    pageSize = 50
  ): Observable<Enrollment[]> {

    return this.http
      .get<PagedResponse<Enrollment>>(
        this.baseUrl,
        {
          params: {
            page: page.toString(),
            pageSize: pageSize.toString(),
          },
        }
      )
      .pipe(
        map((p) => p.items)
      );
  }

  approve(id: number): Observable<Enrollment> {

    return this.http.post<Enrollment>(
      `${this.baseUrl}/${id}/approve`,
      {}
    );
  }
}
