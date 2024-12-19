import express from "express";
import http from "http";
import { DB_NAME, HOST, PORT } from "./src/config";
import Routes from "./src/interfaces/Routes.interface";
import db from "./src/database/models";
import cors from "cors";
import { logger } from "./src/config/logger";
import log from "./src/middlewares/log.middleware";

class App {
  public app: express.Application;
  public routes: Routes[];
  public host: string;
  public port: number;
  private readonly server: http.Server;

  constructor(routes: Routes[]) {
    this.app = express();
    this.routes = routes;
    this.host = HOST ?? "localhost";
    this.port = Number(PORT) || 9000;
    this.server = http.createServer(this.app);

    this.app.use(express.static("public"));
    this.app.use(express.urlencoded({ extended: true }));
    this.app.use(express.json());
    this.app.use(cors());

    this.initializeDb();
    this.initializeRoutes(this.routes);
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
}

export default App;
