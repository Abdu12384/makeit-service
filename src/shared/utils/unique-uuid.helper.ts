import { randomUUID } from "crypto";

export const generateUniqueId = (prefix: string = "user"):string =>{
   return `makeit-${prefix}-${randomUUID().slice(10)}`
}