import { IUserDTO } from "../../../../shared/dtos/user.dto";
import { IClientEntity } from "../../../entities/client.entity";

export interface IRegisterUseCase{
     createUsers(user: IUserDTO):Promise<IClientEntity | null>
}