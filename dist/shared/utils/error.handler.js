"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handleErrorResponse = void 0;
const zod_1 = require("zod");
const custom_error_1 = require("../../domain/utils/custom.error");
const constants_1 = require("../constants");
const handleErrorResponse = (res, error) => {
    // Handle Zod validation errors
    if (error instanceof zod_1.ZodError) {
        console.log("Zod Validation Error:", error);
        const errors = error.errors.map((err) => ({
            field: err.path.join("."),
            message: err.message,
        }));
        return res.status(constants_1.HTTP_STATUS.BAD_REQUEST).json({
            success: false,
            message: constants_1.ERROR_MESSAGES.VALIDATION_ERROR,
            errors,
        });
    }
    // Handle your custom application errors
    if (error instanceof custom_error_1.CustomError) {
        console.log("Custom Error:", error.message);
        return res.status(error.statusCode).json({
            success: false,
            message: error.message,
        });
    }
    // Handle general JS errors
    if (error instanceof Error) {
        console.log("System Error:", error.message);
        return res.status(constants_1.HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
            success: false,
            message: constants_1.ERROR_MESSAGES.SERVER_ERROR,
        });
    }
    // Unknown error
    console.log("Unknown Error:", error);
    return res.status(constants_1.HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: constants_1.ERROR_MESSAGES.SERVER_ERROR,
    });
};
exports.handleErrorResponse = handleErrorResponse;
//# sourceMappingURL=error.handler.js.map