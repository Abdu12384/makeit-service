export interface ISaveFCMTokenUseCase {
   execute(userId: string, token: string, role: string): Promise<void>;
}