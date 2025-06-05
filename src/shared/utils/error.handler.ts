import { Response } from "express";
import { ZodError } from "zod";
import { CustomError } from "../../domain/utils/custom.error.js";
import { ERROR_MESSAGES, HTTP_STATUS } from "../constants.js";

export const handleErrorResponse = (res: Response, error: unknown): Response => {
  // Handle Zod validation errors
  if (error instanceof ZodError) {
    console.log("Zod Validation Error:", error);

    const errors = error.errors.map((err) => ({
      field: err.path.join("."),
      message: err.message,
    }));

    return res.status(HTTP_STATUS.BAD_REQUEST).json({
      success: false,
      message: ERROR_MESSAGES.VALIDATION_ERROR,
      errors,
    });
  }

  // Handle your custom application errors
  if (error instanceof CustomError) {
    console.log("Custom Error:", error.message);

    return res.status(error.statusCode).json({
      success: false,
      message: error.message,
    });
  }

  // Handle general JS errors
  if (error instanceof Error) {
    console.log("System Error:", error.message);

    return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: ERROR_MESSAGES.SERVER_ERROR,
    });
  }

  // Unknown error
  console.log("Unknown Error:", error);

  return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
    success: false,
    message: ERROR_MESSAGES.SERVER_ERROR,
  });
};
