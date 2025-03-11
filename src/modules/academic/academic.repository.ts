import { Course, ICourse } from "./models/course.model";

export const createCourse = async (
  createCourse: ICourse
): Promise<ICourse | undefined> => {
  try {
    const newCourse = new Course(createCourse);

    return await newCourse.save();
  } catch (error: any) {
    console.error(
      `error creating course: ${JSON.stringify(createCourse)}, error: ${error}`
    );
    throw error;
  }
};

export const getCourseByCourseId = async (courseId: string) => {
  try {
    const data = await Course.find({ courseId }).select(
      "-__v -password -createdAt -updatedAt"
    );

    return data;
  } catch (error) {
    console.error(`error in retrieving all courses, error: ${error}`);
    throw error;
  }
};

export const getAllCourses = async () => {
  try {
    const data = await Course.find().select(
      "-__v -password -createdAt -updatedAt"
    );

    return data;
  } catch (error) {
    console.error(`error in retrieving all courses, error: ${error}`);
    throw error;
  }
};
