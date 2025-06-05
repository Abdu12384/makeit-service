export interface IUserExistenceService {
   findUserByEmail(email:string):Promise<{exists: boolean; user: any | null; role: 'client' | 'vendor' | 'admin' | null;}>;
}