import HttpException from "../../util/http-exception.model";
import {
  createCourse,
  getAllCourses,
  getCourseByCourseId,
} from "./academic.repository";
import { ICourse } from "./models/course.model";

export const saveCourse = async (newCourse: ICourse) => {
  try {
    const course = await createCourse(newCourse);
    if (!course) {
      throw new HttpException(500, {
        message: `Error in course: ${JSON.stringify(newCourse)}`,
        result: false,
      });
    }

    return course;
  } catch (error) {
    throw error;
  }
};

export const retrieveCourseByCourseId = async (courseId: string) => {
  try {
    const result = await getCourseByCourseId(courseId);

    if (!result) {
      throw new HttpException(500, {
        message: `Error occurred when retrieving courses by course id: ${courseId}`,
        result: false,
      });
    }

    return result;
  } catch (error: any) {
    throw error;
  }
};

export const retrieveAllCourses = async () => {
  try {
    const result = await getAllCourses();

    if (!result) {
      throw new HttpException(500, {
        message: "Error occurred when retrieving courses",
        result: false,
      });
    }

    return result;
  } catch (error: any) {
    throw error;
  }
};
