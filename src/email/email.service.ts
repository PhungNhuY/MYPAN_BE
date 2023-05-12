import { MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';
import { IUser } from 'src/user/user.interface';

@Injectable()
export class EmailService {
    constructor(private mailerService: MailerService) {}

    async sendUserConfirmation(email: string, token: string) {
        try {
            const url = `${process.env.DOMAIN}/auth/confirm?token=${token}`;

            await this.mailerService.sendMail({
                to: email,
                // from: '"Support Team" <support@example.com>', // override default from
                subject: `${process.env.APP_NAME} xin chào!`,
                template: './confirmation', // `.hbs` extension is appended automatically // ???
                context: { // ✏️ filling curly brackets with content
                    name: email,
                    url,
                },
            });
            console.log(`mail sent to ${email}`);
        } catch (error) {
            console.log('--->>> mailing service error: ', error);
        }
    }

    async sendFogotPassConfirmation(email: string, token: string) {
        try {
            const url = `${process.env.DOMAIN}/auth/forgot?token=${token}`;

            await this.mailerService.sendMail({
                to: email,
                // from: '"Support Team" <support@example.com>', // override default from
                subject: `${process.env.APP_NAME} Xin chào! `,
                template: './forgotPassword', // `.hbs` extension is appended automatically // ???
                context: { // ✏️ filling curly brackets with content
                    name: email,
                    url,
                },
            });
            console.log(`mail sent to ${email}`);
        } catch (error) {
            console.log('--->>> mailing service error: ', error);
        }
    }

    async sendViolationWarning(email: string, name: string, postName: string){
        try {
            await this.mailerService.sendMail({
                to: email,
                // from: '"Support Team" <support@example.com>', // override default from
                subject: `${process.env.APP_NAME} Xin chào! `,
                template: './violate', // `.hbs` extension is appended automatically // ???
                context: { // ✏️ filling curly brackets with content
                    name: email,
                    postName: postName,
                },
            });
            console.log(`mail sent to ${email}`);
        } catch (error) {
            console.log('--->>> mailing service error: ', error);
        }
    }
}
