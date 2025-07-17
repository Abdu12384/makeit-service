import { randomUUID } from "crypto";

export const generateUniqueId = (prefix: string = "user"):string =>{
   return `${randomUUID().slice(10)}`
}