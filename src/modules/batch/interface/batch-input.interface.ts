export interface BatchInput {
  batchId: string;
  batchName?: string;
  batchYear?: number;
  studentCount?: number;
  assignCourses?: string[];
  assignStudents?: string[];
}
