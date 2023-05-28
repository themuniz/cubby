import * as dotenv from 'dotenv'
import { worker } from "./mail.worker";
import { logger } from './utils/logging'

dotenv.config()

worker.on("active", (job) =>
  logger.info(
    `Job ${job.id}/${job.name} is now active, sending email to ${job.data.mailOpts.to}`, { job }
  )
);
worker.on("completed", (job) =>
  logger.info(
    `Completed job ${job.id} successfully, sent email to ${job.data.mailOpts.to}`
  )
);
worker.on("failed", (job, err) =>
  logger.info(`Failed job ${job.id} with ${err}`)
);
