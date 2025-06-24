import bcrypt from 'bcrypt'
import { injectable } from 'tsyringe'
import { IPasswordHasher } from '../../domain/interface/useCaseInterface/auth/passwordHasher.interface'


@injectable()
export class HashPassword implements IPasswordHasher{
   async hash(password: string): Promise<string> {
      const saltRounds = 10;
      return await bcrypt.hash(password,saltRounds)
   }

   async compare(current: string, orginal: string): Promise<boolean> {
      return bcrypt.compare(current,orginal)
   }


}

