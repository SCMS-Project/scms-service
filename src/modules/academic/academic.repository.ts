import { Types } from "mongoose";

import { Course, ICourse } from "./models/course.model";
import { ISubject, Subject } from "./models/subject.model";
import HttpException from "../../util/http-exception.model";
import { SubjectInput } from "./interface/subject-input.interface";

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
    const data = await Course.find({ courseId })
      .select("-__v -password -createdAt -updatedAt")
      .populate({
        path: "subjects",
        select: "-__v -courses -createdAt -updatedAt",
      })
      .select("-__v -createdAt -updatedAt")
      .exec();

    return data;
  } catch (error) {
    console.error(`error in retrieving all courses, error: ${error}`);
    throw error;
  }
};

export const getAllCourses = async () => {
  try {
    const data = await Course.find()
      .select("-__v -password -createdAt -updatedAt")
      .populate({
        path: "subjects",
        select: "-__v -courses -createdAt -updatedAt",
      })
      .select("-__v -createdAt -updatedAt")
      .exec();

    return data;
  } catch (error) {
    console.error(`error in retrieving all courses, error: ${error}`);
    throw error;
  }
};

export const updateCourseWithSubject = async (
  courseId: string,
  subjectId: string | any
) => {
  try {
    await Course.findOneAndUpdate(
      { courseId: courseId },
      { $addToSet: { subjects: subjectId } },
      { new: true, upsert: false }
    );
  } catch (error) {
    console.error(`error in retrieving all courses, error: ${error}`);
    throw error;
  }
};

export const createSubject = async (
  createData: SubjectInput
): Promise<ISubject | undefined> => {
  try {
    const courseIds = await Course.find({
      courseId: { $in: createData.assignCourses },
    }).select("_id");

    const courseObjectIds = courseIds.map((course) => course._id);

    const data = new Subject({
      subjectId: createData.subjectId,
      subjectName: createData.subjectName,
      courses: courseObjectIds,
    });

    return await data.save();
  } catch (error: any) {
    console.error(
      `error creating subject: ${JSON.stringify(createData)}, error: ${error}`
    );
    throw error;
  }
};

export const getAllSubjects = async () => {
  try {
    const students = await Subject.find()
      .populate({
        path: "courses",
        select: "-__v -subjects -createdAt -updatedAt",
      })
      .select("-__v -createdAt -updatedAt")
      .exec();

    return students;
  } catch (error) {
    console.error(`error in retrieving all students, error: ${error}`);
    throw error;
  }
};

export const validateCourseById = async (
  courseId: string,
  isMongoId: boolean
): Promise<boolean> => {
  try {
    if (isMongoId) {
      if (!Types.ObjectId.isValid(courseId)) {
        throw new HttpException(202, {
          message: "Not a valid mongo ID",
          result: false,
        });
      }
    }

    const courseExists = await Course.exists({ courseId });
    return !!courseExists;
  } catch (error) {
    console.error(
      `error in validating course _id: ${courseId},  error: ${JSON.stringify(
        error
      )}`
    );
    throw error;
  }
};
