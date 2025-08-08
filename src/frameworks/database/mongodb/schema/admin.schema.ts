import { Schema } from "mongoose";

export const adminSchema=new Schema({
    userId: {type: String, required: true},
    email: { type: String, required: true, unique: true },
		phone: { type: String, required: true },
		password: { type: String, required: true },
		role: { type: String, default: "admin" },
		isSuperAdmin: { type: Boolean, default: false },
		profileImage:{type: String},
		status: { type: String, default: "active" },
},{
	timestamps: true
})