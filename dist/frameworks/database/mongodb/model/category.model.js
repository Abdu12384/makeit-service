"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CategoryModel = void 0;
const mongoose_1 = require("mongoose");
const category_schema_1 = require("../schema/category.schema");
exports.CategoryModel = (0, mongoose_1.model)("Category", category_schema_1.categorySchema);
//# sourceMappingURL=category.model.js.map