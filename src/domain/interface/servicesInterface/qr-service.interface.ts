
export interface IQRService {
    generateQRCode(ticketId: string): Promise<string>;
}