import {z} from 'zod'
import { strongEmailRegex } from "../../../shared/validation/email.validation.js";
import { passwordSchema } from "../../../shared/validation/password.validation.js";


export const loginSchema = z.object({
	email: strongEmailRegex,
	password: passwordSchema,
	role: z.enum(["admin", "client", "vendor"]),
});
