import { Batch, IBatch } from "./models/batch.model";

export const createBatch = async (
  createData: IBatch
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
