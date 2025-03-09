import { createTransport } from 'nodemailer';
import Config from '../Config';

export interface MailerRecipientType {
  name: string;
  email: string;
}

export interface MailerModuleType {
  sendMail: (
    subject: string,
    recipients: MailerRecipientType[],
    html: string
  ) => void;
}

const MailerModule = (): MailerModuleType => {
  const transporter = createTransport({
    host: Config.mailerHost,
    port: Config.mailerPort,
    secure: Config.mailerUseSsl,
    auth: {
      user: Config.mailerUsername,
      pass: Config.mailerPassword,
    },
  });

  return {
    sendMail: (subject, recipients, html) => {
      transporter.sendMail({
        from: {
          name: Config.mailerFromName,
          address: Config.mailerFromEmail,
        },
        to: recipients.map((recipient) => ({
          name: recipient.name,
          address: recipient.email,
        })),
        subject,
        html,
      });
    },
  };
};

export default MailerModule;
