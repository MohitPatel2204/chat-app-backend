import cron from "node-cron";
import { QUEUE_LIST } from "../utils/constant";
import queue from "./queue";
import { logger } from "../config/logger";
import { delay } from "../utils/functions";

class Cron {
  private readonly cronExecutationTime;
  private readonly queueList: Array<QUEUE_LIST> = [];
  private isProcessing: boolean = false; // Flag to track whether a message is being processed

  constructor() {
    this.cronExecutationTime = "*/2 * * * * *"; // Every 2 seconds
    this.queueList = Object.values(QUEUE_LIST);
  }

  private async receiveMessage() {
    if (this.isProcessing) {
      logger.info("🚀 Cron job is already processing a message. Skipping...");
      return;
    }

    try {
      for (const queueName of this.queueList) {
        // Schedule a job for each queue
        cron
          .schedule(this.cronExecutationTime, async () => {
            try {
              await queue.receiveMessage(queueName);
            } catch (e) {
              logger.info(`🚀 ${(e as Error).message}`);
            }
            await delay(1000); // Ensure a small delay if needed
          })
          .start();
      }
    } catch (error) {
      logger.error(`🚀 Error: ${(error as Error).message}`);
    } finally {
      this.isProcessing = false; // Reset the flag after processing
    }
  }

  public startCron() {
    this.receiveMessage();
    logger.info(`🚀 Cron job is initialized...`);
  }
}

export default Cron;
