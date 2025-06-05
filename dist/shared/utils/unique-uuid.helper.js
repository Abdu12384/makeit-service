import { randomUUID } from "crypto";
export const generateUniqueId = (prefix = "user") => {
    return `makeit-${prefix}-${randomUUID().slice(10)}`;
};
//# sourceMappingURL=unique-uuid.helper.js.map