import { ILoginUserDTO } from "../../../../shared/dtos/user.dto";
import { UserDto } from "../../../../shared/dtos/client.dto";


export interface ILoginUserUseCase{
   execute(
     user:ILoginUserDTO
   ):Promise<UserDto>
} 