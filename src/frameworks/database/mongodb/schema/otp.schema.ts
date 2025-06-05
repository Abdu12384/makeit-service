import { Schema } from "mongoose";
import { IOtpModel } from "../model/otp.model.js";


export const otpSchema = new Schema<IOtpModel>(
  {
    otp: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    expiresAt: {
      type: Date,
      required: true,
      // Automatically delete document 60 seconds after `expiresAt`
      expires: 60,
    },
  },
  { timestamps: true }
);
