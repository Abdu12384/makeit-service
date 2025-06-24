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
exports.ClientRepository = void 0;
const tsyringe_1 = require("tsyringe");
const clientModel_1 = require("../../../frameworks/database/mongodb/model/clientModel");
const base_repository_1 = require("../base.repository");
let ClientRepository = class ClientRepository extends base_repository_1.BaseRepository {
    constructor() {
        super(clientModel_1.ClientModel);
    }
    createClient(client) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield clientModel_1.ClientModel.create(client);
        });
    }
    findByEmail(email) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield clientModel_1.ClientModel.findOne({ email: email });
        });
    }
    updateFcmToken(userId, token) {
        return __awaiter(this, void 0, void 0, function* () {
            yield clientModel_1.ClientModel.updateOne({ userId }, { $set: { fcmToken: token } });
        });
    }
    clearFcmToken(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            yield clientModel_1.ClientModel.updateOne({ userId }, { $unset: { fcmToken: "" } });
        });
    }
};
exports.ClientRepository = ClientRepository;
exports.ClientRepository = ClientRepository = __decorate([
    (0, tsyringe_1.injectable)(),
    __metadata("design:paramtypes", [])
], ClientRepository);
//# sourceMappingURL=client.repository.js.map