/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
// src/email/email.service.ts
import { Injectable } from '@nestjs/common';
import { createTransport } from 'nodemailer';

@Injectable()
export class EmailService {
  private transporter: import('nodemailer').Transporter;

  constructor() {
    this.transporter = createTransport({
      service: 'gmail',
      auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASS,
      },
    });
  }

  async sendEmail(to: string, subject: string, text: string, html: string) {
    const mailOptions = {
      from: `"${process.env.MAIL_FROM_NAME}" <${process.env.MAIL_FROM}>`,
      to,
      subject,
      text,
      html,
    };

    try {
      const info = await this.transporter.sendMail(mailOptions);
      console.log('Email sent: ' + info.response);
      return info;
    } catch (error) {
      console.error('Error sending email: ', error);
      throw new Error('Error sending email');
    }
  }
}
