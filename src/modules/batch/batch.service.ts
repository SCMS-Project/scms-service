import HttpException from "../../util/http-exception.model";
import { validateCourse } from "../academic/academic.service";
import { createBatch, getAllBatch, modifyBatch } from "./batch.repository";
import { BatchInput } from "./interface/batch-input.interface";
import { IBatch } from "./models/batch.model";

export const saveBatch = async (newData: IBatch) => {
  try {
    const result = await createBatch(newData);
    if (!result) {
      throw new HttpException(500, {
        message: `Error in batch: ${JSON.stringify(newData)}`,
        result: false,
      });
    }

    return result;
  } catch (error) {
    throw error;
  }
};

export const updateBatch = async (newData: BatchInput) => {
  try {
    if (newData.assignCourses?.length) {
      newData.assignCourses = await validateCourse(
        newData.assignCourses,
        false
      );
    }

    const result = await modifyBatch(newData);

    if (!result) {
      throw new HttpException(500, {
        message: `Error in updating batch: ${JSON.stringify(newData)}`,
        result: false,
      });
    }

    return result;
  } catch (error) {
    throw error;
  }
};

export const retrieveAllBatch = async () => {
  try {
    const result = await getAllBatch();

    if (!result) {
      throw new HttpException(500, {
        message: "Error occurred when retrieving batch",
        result: false,
      });
    }

    return result;
  } catch (error: any) {
    throw error;
  }
};
