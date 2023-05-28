import { MailJob } from "./mail-job.interface";
import { Job } from "bullmq";

import nodemailer from "nodemailer";
import config from "./config";
import puppeteer from "puppeteer";
import Mail from "nodemailer/lib/mailer";
import { logger } from "./utils/logging";

let transporter: Mail;

transporter = nodemailer.createTransport(config.smtp);

export default async (job: Job<MailJob>) => {
  let attachments;
  if (job.data.htmlAttachments) {
    attachments = await Promise.all(
      job.data.htmlAttachments.map(async (attachment) => {
        const browser = await puppeteer.launch({
          headless: true,
          args: ["--no-sandbox", "--disable-setuid-sandbox"],
        });
        const page = await browser.newPage();

        await page.setContent(attachment.html);

        const pdf = await page.pdf({ format: "a4", printBackground: true });

        await browser.close();

        return { filename: `${attachment.name}.pdf`, content: pdf };
      })
    );
  }

  return transporter.sendMail({ ...job.data.mailOpts, attachments });
};
