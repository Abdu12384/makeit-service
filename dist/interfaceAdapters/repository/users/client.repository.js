var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { injectable } from 'tsyringe';
import { ClientModel } from "../../../frameworks/database/mongodb/model/clientModel.js";
import { BaseRepository } from '../base.repository.js';
let ClientRepository = class ClientRepository extends BaseRepository {
    constructor() {
        super(ClientModel);
    }
    async createClient(client) {
        return await ClientModel.create(client);
    }
    async findByEmail(email) {
        return await ClientModel.findOne({ email: email });
    }
    async updateFcmToken(userId, token) {
        await ClientModel.updateOne({ userId }, { $set: { fcmToken: token } });
    }
    async clearFcmToken(userId) {
        await ClientModel.updateOne({ userId }, { $unset: { fcmToken: "" } });
    }
};
ClientRepository = __decorate([
    injectable(),
    __metadata("design:paramtypes", [])
], ClientRepository);
export { ClientRepository };
//# sourceMappingURL=client.repository.js.map