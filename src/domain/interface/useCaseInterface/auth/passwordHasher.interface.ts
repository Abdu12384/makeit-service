export interface IPasswordHasher {
   hash(password:string): Promise<string>
   compare(current: string, orginal: string): Promise<boolean>
}