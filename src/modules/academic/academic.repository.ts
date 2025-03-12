import { Types } from "mongoose";

import { Course, ICourse } from "./models/course.model";
import { ISubject, Subject } from "./models/subject.model";
import HttpException from "../../util/http-exception.model";
import { SubjectInput } from "./interface/subject-input.interface";
import { Batch, IBatch } from "../batch/models/batch.model";

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
    const data = new Subject({
      subjectId: createData.subjectId,
      subjectName: createData.subjectName,
      courses: createData.assignCourses,
    });

    for (const course of createData.assignCourses ?? []) {
      await Course.findOneAndUpdate(
        { _id: course },
        { $addToSet: { subjects: data._id } },
        { new: true, upsert: false }
      );
    }

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

export const validateCoursesById = async (
  courseIds: string[],
  isMongoId: boolean
): Promise<string[]> => {
  try {
    if (isMongoId) {
      const invalidIds = courseIds.filter((id) => !Types.ObjectId.isValid(id));
      if (invalidIds.length > 0) {
        throw new HttpException(202, {
          message: `Invalid Mongo ID(s): ${invalidIds.join(", ")}`,
          result: false,
        });
      }
    }

    const courses = await Course.find(
      { courseId: { $in: courseIds } },
      { _id: 1 }
    ).lean();

    if (!courses.length) {
      throw new HttpException(202, {
        message: "No valid courses found",
        result: false,
      });
    }

    return courses.map((course) => course._id.toString());
  } catch (error) {
    console.error(
      `Error in validating course _ids: ${JSON.stringify(
        courseIds
      )}, error: ${JSON.stringify(error)}`
    );
    throw error;
  }
};
