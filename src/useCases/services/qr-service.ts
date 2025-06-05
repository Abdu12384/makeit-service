import { injectable } from "tsyringe";
import QRCode from "qrcode"
import { IQRService } from "../../domain/interface/servicesInterface/qr-service.interface";








@injectable()

export class QRService implements IQRService {
    constructor(){}

    async generateQRCode(ticketId: string): Promise<string> {
        try {
        const qrCode = await QRCode.toDataURL(ticketId)
        return qrCode
        } catch (error) {
            console.error(error)
            throw error
        }
    }
}