import { User } from "../../../entities/user.entity";

export interface IChangePasswordUseCase {
    execute(userId: string, currentPassword: string, newPassword: string, role: string): Promise<void>;
}
    