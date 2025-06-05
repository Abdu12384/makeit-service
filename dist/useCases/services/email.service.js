var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import nodemailer from 'nodemailer';
import { injectable } from "tsyringe";
import { VERIFICATION_MAIL_CONTENT } from "../../shared/constants.js";
let EmailService = class EmailService {
    _transporter;
    constructor() {
        this._transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS
            }
        });
    }
    async _sendMail(mailOptions) {
        const info = await this._transporter.sendMail(mailOptions);
        console.log('Email sent', info.response);
    }
    async sendOtpEmail(email, subject, otp) {
        try {
            console.log(email, subject);
            const mailOptions = {
                from: process.env.EMAIL_USER,
                to: email,
                subject: subject,
                html: VERIFICATION_MAIL_CONTENT(otp)
            };
            await this._transporter.sendMail(mailOptions);
            console.log(`OTP sent to ${email}`);
        }
        catch (error) {
            console.error("Error sending OTP email:", error);
        }
    }
    async sendCustomEmail(to, subject, content) {
        console.log(process.env.EMAIL_USER);
        const mailOptions = {
            from: process.env.EMAIL_USER,
            to,
            subject,
            html: content,
        };
        await this._sendMail(mailOptions);
    }
};
EmailService = __decorate([
    injectable(),
    __metadata("design:paramtypes", [])
], EmailService);
export { EmailService };
//# sourceMappingURL=email.service.js.map