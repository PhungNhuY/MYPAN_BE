import { MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';
import { IUser } from 'src/user/user.interface';

@Injectable()
export class EmailService {
    constructor(private mailerService: MailerService) {}

    async sendUserConfirmation(email: string, token: string) {
        const url = `${process.env.DOMAIN}/auth/confirm?token=${token}`;

        await this.mailerService.sendMail({
            to: email,
            // from: '"Support Team" <support@example.com>', // override default from
            subject: `Welcome to ${process.env.APP_NAME}! Confirm your Email`,
            template: './confirmation', // `.hbs` extension is appended automatically // ???
            context: { // ✏️ filling curly brackets with content
                name: email,
                url,
            },
        });
        console.log(email, token);
    }
}
