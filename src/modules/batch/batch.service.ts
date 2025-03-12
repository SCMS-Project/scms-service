import HttpException from "../../util/http-exception.model";
import { createBatch, getAllBatch } from "./batch.repository";
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
