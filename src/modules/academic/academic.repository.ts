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
  console.log("updateCourseWithSubject repo hit");
  try {
    await Course.findOneAndUpdate(
      { _id: courseId },
      { $addToSet: { subjects: subjectId } },
      { new: true, upsert: false }
    );
  } catch (error) {
    console.error(`error in updateCourseWithSubject, error: ${error}`);
    throw error;
  }
};

export const removeCourse = async (courseId: string): Promise<void> => {
  console.log("removeCourse repo hit");
  try {
    const course = await Course.findById(courseId);
    if (!course) {
      throw new Error(`Subject with ID ${courseId} not found`);
    }

    await Subject.updateMany(
      { _id: { $in: course.subjects } },
      { $pull: { courses: courseId } }
    );

    await Course.findByIdAndDelete(courseId);
  } catch (error: any) {
    console.error(`Error deleting course: ${courseId}, error: ${error}`);
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

export const editSubject = async (
  updateData: SubjectInput
): Promise<ISubject | any> => {
  console.log("editSubject repo hit");
  try {
    const updatedSubject = await Subject.findOneAndUpdate(
      { _id: updateData.subjectId },
      {
        $set: { subjectName: updateData.subjectName },
      },
      { new: true, upsert: false }
    );

    console.log("editSubject repo executed");
    return updatedSubject;
  } catch (error: any) {
    console.error(
      `error updating subject: ${JSON.stringify(
        updateData
      )}, error: ${JSON.stringify(error)}`
    );
    throw error;
  }
};

export const editSubjectWithCourse = async (
  updateData: SubjectInput
): Promise<ISubject | any> => {
  try {
    const updatedSubject = await Subject.findOneAndUpdate(
      { _id: updateData.subjectId },
      {
        $set: { subjectName: updateData.subjectName },
        $addToSet: { courses: { $each: updateData.assignCourses } },
      },
      { new: true, upsert: false }
    );

    return updatedSubject;
  } catch (error: any) {
    console.error(
      `error updating editSubjectWithCourse: ${JSON.stringify(
        updateData
      )}, error: ${JSON.stringify(error)}`
    );
    throw error;
  }
};

export const removeSubject = async (subjectId: string): Promise<void> => {
  console.log("removeSubject repo hit");
  try {
    const subject = await Subject.findById(subjectId);
    if (!subject) {
      throw new Error(`Subject with ID ${subjectId} not found`);
    }

    await Course.updateMany(
      { _id: { $in: subject.courses } },
      { $pull: { subjects: subjectId } }
    );

    await Subject.findByIdAndDelete(subjectId);
  } catch (error: any) {
    console.error(`Error deleting subject: ${subjectId}, error: ${error}`);
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
    let courses;
    if (isMongoId) {
      const invalidIds = courseIds.filter((id) => !Types.ObjectId.isValid(id));

      if (invalidIds.length > 0) {
        throw new HttpException(202, {
          message: `Invalid Mongo ID(s): ${invalidIds.join(", ")}`,
          result: false,
        });
      }

      courses = await Course.find(
        { _id: { $in: courseIds } },
        { _id: 1 }
      ).lean();
    } else {
      courses = await Course.find(
        { courseId: { $in: courseIds } },
        { _id: 1 }
      ).lean();

      if (!courses.length) {
        throw new HttpException(202, {
          message: "No valid courses found",
          result: false,
        });
      }
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

export const validateSubjectById = async (
  subjectIds: string[],
  isMongoId: boolean
): Promise<string[]> => {
  try {
    let subjects;
    if (isMongoId) {
      const invalidIds = subjectIds.filter((id) => !Types.ObjectId.isValid(id));

      if (invalidIds.length > 0) {
        throw new HttpException(202, {
          message: `Invalid Mongo ID(s): ${invalidIds.join(", ")}`,
          result: false,
        });
      }

      subjects = await Subject.find(
        { _id: { $in: subjectIds } },
        { _id: 1 }
      ).lean();
    } else {
      subjects = await Subject.find(
        { subjectId: { $in: subjectIds } },
        { _id: 1 }
      ).lean();

      if (!subjects.length) {
        throw new HttpException(202, {
          message: "No valid courses found",
          result: false,
        });
      }
    }

    return subjects.map((subject) => subject._id.toString());
  } catch (error) {
    console.error(
      `Error in validating subject _ids: ${JSON.stringify(
        subjectIds
      )}, error: ${JSON.stringify(error)}`
    );
    throw error;
  }
};
