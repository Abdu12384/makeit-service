import { Request,Response } from "express";
import { ZodError } from "zod";
import { CustomError } from "../../domain/utils/custom.error";
import { ERROR_MESSAGES, HTTP_STATUS } from "../constants";
import logger from "./error.logger";

export const handleErrorResponse = (req:Request,res: Response, error: unknown): Response => {

  logger.error(`[${req.method}] ${req.url} - ${(error as Error).message}`, {
		ip: req.ip,
		userAgent: req.headers["user-agent"],
		stack: (error as Error).stack,
	});

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
