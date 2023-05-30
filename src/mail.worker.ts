import { Worker, QueueScheduler } from 'bullmq';
import config from "./config";
import { MailJob } from "./mail-job.interface";
import { logger } from './utils/logging'

export const worker = new Worker<MailJob>(
  config.queueName,
  __dirname + "/mail.proccessor.js",
  {
    connection: config.connection,
    concurrency: config.concurrency,
    limiter: config.limiter,
  }
);

export const scheduler = new QueueScheduler(config.queueName, {
  connection: config.connection,
});

logger.info("Worker listening for jobs");
