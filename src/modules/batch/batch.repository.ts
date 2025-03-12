import { Course } from "../academic/models/course.model";
import { BatchInput } from "./interface/batch-input.interface";
import { Batch, IBatch } from "./models/batch.model";

export const createBatch = async (
  createData: IBatch | any
): Promise<IBatch | undefined> => {
  try {
    const result = new Batch(createData);

    return await result.save();
  } catch (error: any) {
    console.error(
      `error creating batch: ${JSON.stringify(createData)}, error: ${error}`
    );
    throw error;
  }
};

export const getAllBatch = async () => {
  try {
    const data = await Batch.find().select("-__v -createdAt -updatedAt").exec();

    return data;
  } catch (error) {
    console.error(`error in retrieving all batch, error: ${error}`);
    throw error;
  }
};

export const modifyBatch = async (updateData: BatchInput) => {
  try {
    const result = await Batch.findOneAndUpdate(
      { batchId: updateData.batchId },
      { $addToSet: { courses: { $each: updateData.assignCourses } } },
      { new: true, upsert: false }
    );

    return result;
  } catch (error) {
    console.error(
      `error in updating batch batchId: ${
        updateData.batchId
      } with courseId: ${JSON.stringify(
        updateData.assignCourses
      )}, error: ${error}`
    );
    throw error;
  }
};
