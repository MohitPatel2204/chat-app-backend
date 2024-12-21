import amqp from 'amqplib';
import { HOST } from '../config';
import { QUEUE_LIST } from '../utils/constant';
import { logger } from '../config/logger';
import { delay, sendEmail } from '../utils/functions';
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
      this.connection = await amqp.connect(`amqp://${HOST ?? 'localhost'}`);
      this.channel = await this.connection.createChannel();
      logger.info('🚀 Queue connected to RabbitMQ server');

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

  async processData(message: amqp.ConsumeMessage) {
    const messageData = JSON.parse(Buffer.from(message.content).toString());
    try {
      let result;
      switch (message.fields.routingKey) {
        case QUEUE_LIST.SEND_EMAIL:
          result = await sendEmail(
            messageData.to,
            messageData.subject,
            messageData.context,
            messageData.template,
            messageData.cc,
            messageData.attachments
          );
          if (!result.isValid) {
            throw new Error(result.message);
          }
          break;
        default:
          logger.warn(`🚀 ${message.fields.routingKey} queue is invalid...`);
      }
    } catch (error) {
      logger.error(`🚀 Error processing message: ${(error as Error).message}`);
      let retryCount =
        message.properties.headers &&
        message.properties.headers['X-retry-count']
          ? parseInt(message.properties.headers['X-retry-count'])
          : 0;

      if (retryCount > 3) {
        logger.error(`🚀 Message will be discarded after 3 retries...`);
      } else {
        retryCount++;
        logger.info(`${message.fields.routingKey} message retry ${retryCount}`);
        await delay(1000);
        await this.sendMessage(
          message.fields.routingKey as QUEUE_LIST,
          messageData,
          {
            headers: {
              'X-retry-count': retryCount,
            },
          }
        );
      }
    }
  }

  // Consume messages from the queue
  async receiveMessage(queueName: QUEUE_LIST) {
    if (!this.connection || !this.channel) {
      logger.warn('🚀 RabbitMQ server connection is not established');
      return null;
    }

    const messageExisting = await this.channel?.checkQueue(queueName);
    if (messageExisting.messageCount === 0) {
      throw new Error(`No message received for queue ${queueName}`);
    }
    this.channel?.consume(queueName, (message: amqp.ConsumeMessage | null) => {
      if (message) {
        this.processData(message).then(() => {
          this.channel?.ack(message);
        });
      } else {
        throw new Error(`No message received for queue ${queueName}`);
      }
    });
  }

  //send message in queue
  async sendMessage(
    queueName: QUEUE_LIST,
    data: unknown,
    header?: amqp.Options.Publish
  ) {
    try {
      if (!this.connection || !this.channel) {
        logger.warn('🚀 RabbitMQ server connection is not established');
        return;
      }

      // Send message to the queue
      await this.channel.sendToQueue(
        queueName,
        Buffer.from(JSON.stringify(data)),
        { ...header, persistent: true } // Ensure message durability
      );
      logger.info(`🚀 Message sent to ${queueName} queue`);
    } catch (error) {
      logger.error(
        `${queueName} data not sent to queue: ${(error as Error).message}`
      );
    }
  }

  // Close the connection and channel
  async closeConnection() {
    try {
      if (this.channel) {
        await this.channel.close();
        logger.info('🚀 RabbitMQ channel closed');
      }
      if (this.connection) {
        await this.connection.close();
        logger.info('🚀 RabbitMQ connection closed');
      }
    } catch (error) {
      logger.error(
        `🚀 Error closing RabbitMQ connection: ${(error as Error).message}`
      );
    }
  }
}

export default new Queue();
