"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BaseRepository = void 0;
class BaseRepository {
    constructor(model) {
        this.model = model;
    }
    find() {
        return __awaiter(this, arguments, void 0, function* (filter = {}) {
            return this.model.find(filter);
        });
    }
    findAll() {
        return __awaiter(this, arguments, void 0, function* (filter = {}, skip = 0, limit = 10, sort = {}) {
            const [items, total] = yield Promise.all([
                this.model.find(filter).skip(skip).limit(limit).sort(sort).lean(),
                this.model.countDocuments(filter),
            ]);
            return { items, total };
        });
    }
    findOne(filter) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.model.findOne(filter).lean();
        });
    }
    save(data) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.model.create(data);
        });
    }
    update(filter, updateData) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.model
                .findOneAndUpdate(filter, updateData, { new: true })
                .lean();
        });
    }
    delete(filter) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.model.findOneAndDelete(filter).lean();
        });
    }
}
exports.BaseRepository = BaseRepository;
//# sourceMappingURL=base.repository.js.map