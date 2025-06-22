export interface IUpdateNotificationReadUseCase {
    execute(userId: string): Promise<void>;
}