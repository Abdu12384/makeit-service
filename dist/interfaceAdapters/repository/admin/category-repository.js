"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CategoryRepository = void 0;
const base_repository_1 = require("../base.repository");
const category_model_1 = require("../../../frameworks/database/mongodb/model/category.model");
const tsyringe_1 = require("tsyringe");
let CategoryRepository = class CategoryRepository extends base_repository_1.BaseRepository {
    constructor() {
        super(category_model_1.CategoryModel);
    }
};
exports.CategoryRepository = CategoryRepository;
exports.CategoryRepository = CategoryRepository = __decorate([
    (0, tsyringe_1.injectable)(),
    __metadata("design:paramtypes", [])
], CategoryRepository);
//# sourceMappingURL=category-repository.js.map