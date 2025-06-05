import { UserDTO } from "../../../../shared/dtos/user.dto";
import { IClientEntity } from "../../../entities/client.entity";

export interface IRegisterUseCase{
     createUsers(user: UserDTO):Promise<IClientEntity | null>
}