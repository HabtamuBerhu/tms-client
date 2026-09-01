export interface Enrollment {
  id: string;
  studentId: number;
  studentName: string;
  courseId: number;
  courseName: string;
  status: "Pending" | "Approved" | "Rejected";
  enrolledAt: string;
}

export interface PagedResponse<T> {
items: T[];
totalCount: number;
page: number;
pageSize: number;
totalPages: number;
hasPrevious: boolean;
hasNext: boolean;
}