import amqp from "amqplib";
import { HOST } from "../config";
import { QUEUE_LIST } from "../utils/constant";
import { logger } from "../config/logger";

class Queue {
  private connection: amqp.Connection | null = null;
  private channel: amqp.Channel | null = null;
  private queueList: Array<string> = [];

  constructor() {
    this.queueList = Object.values(QUEUE_LIST);
    this.init();
  }

  async init() {
    try {
      // Connect to RabbitMQ server
      this.connection = await amqp.connect(`amqp://${HOST ?? "localhost"}`);
      this.channel = await this.connection.createChannel();
      logger.info("🚀 Queue connected to RabbitMQ server");

      // Initialize all queues
      for (const queueName of this.queueList) {
        const data = await this.channel.assertQueue(queueName, {
          durable: true,
        });
        logger.info(`🚀 ${data.queue} queue initialized`);
      }
    } catch (error) {
      logger.error(
        `🚀 Error initializing RabbitMQ: ${(error as Error).message}`
      );
    }
  }

  async sendMessage(queueName: QUEUE_LIST, data: unknown) {
    try {
      if (!this.connection || !this.channel) {
        logger.warn("🚀 RabbitMQ server connection is not established");
        return;
      }

      // Send message to the queue
      this.channel.sendToQueue(
        queueName,
        Buffer.from(JSON.stringify(data)),
        { persistent: true } // Ensure message durability
      );
      logger.info(`🚀 Message sent to ${queueName} queue`);
    } catch (error) {
      logger.error(
        `${queueName} data not sent to queue: ${(error as Error).message}`
      );
    }
  }

  async closeConnection() {
    try {
      if (this.channel) {
        await this.channel.close();
        logger.info("🚀 RabbitMQ channel closed");
      }
      if (this.connection) {
        await this.connection.close();
        logger.info("🚀 RabbitMQ connection closed");
      }
    } catch (error) {
      logger.error(
        `🚀 Error closing RabbitMQ connection: ${(error as Error).message}`
      );
    }
  }
}

export default new Queue();
