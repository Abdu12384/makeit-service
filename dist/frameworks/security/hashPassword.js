var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import bcrypt from 'bcrypt';
import { injectable } from 'tsyringe';
let HashPassword = class HashPassword {
    async hash(password) {
        const saltRounds = 10;
        return await bcrypt.hash(password, saltRounds);
    }
    async compare(current, orginal) {
        return bcrypt.compare(current, orginal);
    }
};
HashPassword = __decorate([
    injectable()
], HashPassword);
export { HashPassword };
//# sourceMappingURL=hashPassword.js.map