import * as dotenv from 'dotenv'
import { worker } from "./mail.worker";

dotenv.config()

worker.on("completed", (job) =>
  console.log(
    `Completed job ${job.id} successfully, sent email to ${job.data.mailOpts.to}`
  )
);
worker.on("failed", (job, err) =>
  console.log(`Failed job ${job.id} with ${err}`)
);
