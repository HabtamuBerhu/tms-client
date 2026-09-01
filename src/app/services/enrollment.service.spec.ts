
import { TestBed } from "@angular/core/testing";

import { provideHttpClient } from "@angular/common/http";
import {
  HttpTestingController,
  provideHttpClientTesting,
} from "@angular/common/http/testing";

import { firstValueFrom } from "rxjs";

import { EnrollmentService } from "./enrollment.service";

describe("EnrollmentService", () => {
  let httpMock: HttpTestingController;
  let service: EnrollmentService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
      ],
    });

    httpMock = TestBed.inject(HttpTestingController);
    service = TestBed.inject(EnrollmentService);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it("should be created", () => {
    expect(service).toBeTruthy();
  });

  it("getAll() issues GET /api/v1/enrollments and maps the response", async () => {
    const result = firstValueFrom(service.getAll());

    const req = httpMock.expectOne(
      (r) =>
        r.url.endsWith("/api/v1/enrollments")
    );

    expect(req.request.method).toBe("GET");

    req.flush({
      items: [
        {
          id: 1,
          studentId: 11,
          studentName: "Abeba",
          courseId: 101,
          courseName: "Intro to CS",
          status: "Pending",
          enrolledAt: "2026-08-12T10:00:00Z",
        },
        {
          id: 2,
          studentId: 12,
          studentName: "Kebede",
          courseId: 102,
          courseName: "Data Structures",
          status: "Approved",
          enrolledAt: "2026-08-12T10:05:00Z",
        },
      ],
      totalCount: 2,
      page: 1,
      pageSize: 50,
      totalPages: 1,
    });

    const enrollments = await result;

    expect(enrollments).toHaveLength(2);
    expect(enrollments[0].courseName).toBe("Intro to CS");
  });

  it("approve(id) issues POST /api/v1/enrollments/{id}/approve", async () => {
    const result = firstValueFrom(
      service.approve(42)
    );

    const req = httpMock.expectOne(
      (r) =>
        r.url.endsWith(
          "/api/v1/enrollments/42/approve"
        )
    );

    expect(req.request.method).toBe("POST");

    req.flush({
      id: 42,
      studentId: 11,
      studentName: "Abeba",
      courseId: 101,
      courseName: "Intro to CS",
      status: "Approved",
      enrolledAt: "2026-08-12T10:00:00Z",
    });

    const approved = await result;

    expect(approved.status).toBe("Approved");
  });
});
