import { JobsOptions, Queue, QueueOptions } from "bullmq";
import { MailJob } from "./mail-job.interface";
import config from "./config";
import { logger } from './utils/logging'

export class MailbotClient {
  private queue: Queue;

  constructor(opts: QueueOptions) {
    this.queue = new Queue<MailJob>(config.queueName, {
      defaultJobOptions: {
        attempts: 5,
        backoff: { type: "exponential", delay: 3000 },
      },
      ...opts,
    });
  }

  async enqueue(jobName: string, mail: MailJob, jobOpts?: JobsOptions) {
    const response = await this.queue.add(jobName, mail);
    console.log(response)
    logger.info(`Enqueued an email sending to ${mail.mailOpts.to}`, { response });
  }

  close() {
    return this.queue.close();
  }
}
