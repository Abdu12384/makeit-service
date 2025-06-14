var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
import { inject, injectable } from "tsyringe";
import { CustomError } from "../../domain/utils/custom.error.js";
import { ERROR_MESSAGES, HTTP_STATUS } from "../../shared/constants.js";
import { generateUniqueId } from "../../shared/utils/unique-uuid.helper.js";
let AddWorkSampleUseCase = class AddWorkSampleUseCase {
    _workSampleRepository;
    constructor(_workSampleRepository) {
        this._workSampleRepository = _workSampleRepository;
    }
    async execute(data) {
        const { title, description, images, vendorId } = data;
        if (!title || !description || !images || !vendorId) {
            throw new CustomError(ERROR_MESSAGES.MISSING_PARAMETERS, HTTP_STATUS.BAD_REQUEST);
        }
        const workSampleId = generateUniqueId("workSample");
        await this._workSampleRepository.save({
            ...data,
            workSampleId,
        });
    }
};
AddWorkSampleUseCase = __decorate([
    injectable(),
    __param(0, inject("IWorkSampleRepository")),
    __metadata("design:paramtypes", [Object])
], AddWorkSampleUseCase);
export { AddWorkSampleUseCase };
//# sourceMappingURL=add-work-sample.usecase.js.map