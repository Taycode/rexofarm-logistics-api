import { Injectable } from '@nestjs/common';
import { ISendMailOptions, MailerService } from '@nestjs-modules/mailer';

@Injectable()
export class EmailService {
  constructor(private readonly mailerService: MailerService) {}

  async sendEmail(mailOptions: ISendMailOptions) {
    return this.mailerService.sendMail(mailOptions);
  }
}
