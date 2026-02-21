import { isValidObjectId } from "mongoose";

export const objectIdValidator = (value, helpers) => {
  if (!isValidObjectId(value)) {
    return helpers.message("Invalid id");
  }
  return value;
};
