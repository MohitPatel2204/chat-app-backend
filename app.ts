import express from "express";
import http from "http";
import { DB_NAME, HOST, PORT } from "./src/config";
import Routes from "./src/interfaces/Routes.interface";
import db from "./src/database/models";
import cors from "cors";
import { logger } from "./src/config/logger";
import log from "./src/middlewares/log.middleware";
import Cron from "./src/services/cron";
import swaggerUi from "swagger-ui-express";
import path from "path";
import fs from "fs";

class App {
  public app: express.Application;
  public routes: Routes[];
  public host: string;
  public port: number;
  private readonly server: http.Server;
  private readonly cron;

  constructor(routes: Routes[]) {
    this.app = express();
    this.routes = routes;
    this.host = HOST ?? "localhost";
    this.port = Number(PORT) || 9000;
    this.server = http.createServer(this.app);
    this.cron = new Cron();

    this.app.use(express.static("public"));
    this.app.use(express.urlencoded({ extended: true }));
    this.app.use(express.json());
    this.app.use(cors());

    this.initializeDb();
    this.initializeRoutes(this.routes);
    this.initializeCron();
    this.initializeSwagger();
  }

  listen() {
    this.server.listen(this.port, () => {
      logger.info("======================================================");
      logger.info(
        `🚀 Server is running on http://${this.host}:${this.port}/api`
      );
      logger.info("======================================================");
    });
  }

  public getServer() {
    return this.app;
  }

  private initializeRoutes(routes: Routes[]) {
    routes.forEach((route) => {
      this.app.use("/api", log, route.router);
    });
  }

  private initializeDb() {
    try {
      db.connect();
      logger.info(`🚀 ${DB_NAME} Database connected...`);
    } catch (error) {
      logger.error(`🚀 Error: ${(error as Error).message}`);
    }
  }

  private async initializeCron() {
    try {
      this.cron.startCron();
    } catch (error) {
      logger.error(`🚀 Error : ${(error as Error).message}`);
    }
  }

  private async initializeSwagger() {
    try {
      const swaggerFilePath = path.join(__dirname, "swagger.json");
      const swaggerFileContent = fs.readFileSync(swaggerFilePath, "utf8");
      const swaggerSpec = {
        openapi: "3.0.0",
        info: {
          title: "Chat App",
          description: "API for Chat Application",
          version: "1.0.0",
        },
        servers: [
          {
            url: `http://${HOST}:${PORT}/api`,
            description: "local server",
          },
        ],
        ...JSON.parse(swaggerFileContent),
      };

      this.app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
      logger.info("🚀 Swagger initialized...");
    } catch (error) {
      logger.error(`🚀 Error: ${(error as Error).message}`);
    }
  }
}

export default App;
