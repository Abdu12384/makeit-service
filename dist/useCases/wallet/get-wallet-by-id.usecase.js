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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
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
exports.GetWalletByIdUseCase = void 0;
const tsyringe_1 = require("tsyringe");
const unique_uuid_helper_1 = require("../../shared/utils/unique-uuid.helper");
let GetWalletByIdUseCase = class GetWalletByIdUseCase {
    constructor(walletRepository, transactionRepository) {
        this.walletRepository = walletRepository;
        this.transactionRepository = transactionRepository;
    }
    execute(userId, pageNumber, pageSize) {
        return __awaiter(this, void 0, void 0, function* () {
            const validPageNumber = Math.max(1, pageNumber || 1);
            const validPageSize = Math.max(1, pageSize || 10);
            const skip = (validPageNumber - 1) * validPageSize;
            const limit = validPageSize;
            const sort = { createdAt: -1 };
            let wallet = yield this.walletRepository.findOne({ userId });
            if (!wallet) {
                const walletId = (0, unique_uuid_helper_1.generateUniqueId)("wallet");
                const newWallet = {
                    walletId,
                    userId,
                    balance: 0,
                    userModel: "client",
                    createdAt: new Date(),
                    updatedAt: new Date(),
                };
                wallet = yield this.walletRepository.save(newWallet);
            }
            const { items, total } = yield this.transactionRepository.findAll({ walletId: wallet.walletId }, skip, limit, sort);
            const response = {
                wallet,
                transaction: items,
                total: Math.ceil(total / validPageSize)
            };
            return response;
        });
    }
};
exports.GetWalletByIdUseCase = GetWalletByIdUseCase;
exports.GetWalletByIdUseCase = GetWalletByIdUseCase = __decorate([
    (0, tsyringe_1.injectable)(),
    __param(0, (0, tsyringe_1.inject)("IWalletRepository")),
    __param(1, (0, tsyringe_1.inject)("ITransactionRepository")),
    __metadata("design:paramtypes", [Object, Object])
], GetWalletByIdUseCase);
//# sourceMappingURL=get-wallet-by-id.usecase.js.map