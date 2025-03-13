import {
  createCourse,
  createSubject,
  editSubject,
  editSubjectWithCourse,
  getAllCourses,
  getAllSubjects,
  getCourseByCourseId,
  removeSubject,
  updateCourseWithSubject,
  validateCoursesById,
  validateSubjectById,
} from "./academic.repository";
import { SubjectInput } from "./interface/subject-input.interface";
import { ICourse } from "./models/course.model";
import HttpException from "../../util/http-exception.model";

export const saveCourse = async (newCourse: ICourse) => {
  try {
    const result = await createCourse(newCourse);
    if (!result) {
      throw new HttpException(500, {
        message: `Error in course: ${JSON.stringify(newCourse)}`,
        result: false,
      });
    }

    return result;
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

export const saveSubject = async (newData: SubjectInput) => {
  try {
    if (newData.assignCourses?.length) {
      newData.assignCourses = await validateCourse(
        newData.assignCourses,
        false
      );
    }

    const result = await createSubject(newData);
    if (!result) {
      throw new HttpException(500, {
        message: `Error in saving subject: ${JSON.stringify(newData)}`,
        result: false,
      });
    }

    if (newData.assignCourses?.length) {
      await Promise.all(
        newData.assignCourses.map((courseId) =>
          updateCourseWithSubject(courseId, result._id)
        )
      );
    }

    return result;
  } catch (error) {
    throw error;
  }
};

export const retrieveAllSubjects = async () => {
  try {
    const result = await getAllSubjects();

    if (!result) {
      throw new HttpException(500, {
        message: "Error occurred when retrieving subjects",
        result: false,
      });
    }

    return result;
  } catch (error: any) {
    throw error;
  }
};

export const updateSubject = async (newData: SubjectInput) => {
  console.log("updateSubject service hit");
  try {
    let result;
    let validatedSubjectIds = await validateSubject([newData.subjectId], false);

    newData.subjectId = validatedSubjectIds?.[0];

    if (newData.assignCourses?.length) {
      newData.assignCourses = await validateCourse(
        newData.assignCourses,
        false
      );

      const data = await editSubjectWithCourse(newData);

      if (data) {
        await Promise.all(
          newData.assignCourses.map((courseId) =>
            updateCourseWithSubject(courseId, data._id)
          )
        );
      }

      result = data;
    } else {
      result = await editSubject(newData);
    }

    if (!result) {
      throw new HttpException(500, {
        message: `Error in updating subject: ${JSON.stringify(newData)}`,
        result: false,
      });
    }

    return result;
  } catch (error) {
    throw error;
  }
};

export const deleteSubject = async (id: string) => {
  console.log("deleteSubject service hit");
  try {
    let validatedSubjectIds = await validateSubject([id], false);
    id = validatedSubjectIds?.[0];

    const result = await removeSubject(id);

    return result;
  } catch (error: any) {
    throw new HttpException(500, {
      message: `Error occurred when deleting subjectId - ${id} courses`,
      result: false,
    });
  }
};

export const validateCourse = async (
  id: string[],
  isMongo: boolean
): Promise<string[] | any> => {
  const validatedData = await validateCoursesById(id, isMongo);

  if (!validatedData || validatedData.length === 0) {
    throw new HttpException(202, {
      message: `CourseId not found - ID: ${id}`,
    });
  }

  return validatedData;
};

export const validateSubject = async (
  id: string[],
  isMongo: boolean
): Promise<string[] | any> => {
  console.log("validateSubject service hit");
  const validatedData = await validateSubjectById(id, isMongo);

  if (!validatedData || validatedData.length === 0) {
    throw new HttpException(202, {
      message: `SubjectId not found - ID: ${id}`,
    });
  }

  console.log("validateSubject service executed");
  return validatedData;
};
