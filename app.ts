import express, { RouterOptions } from "express";
import http from "http";
import { HOST, PORT } from "./src/config";
import Routes from "./src/interfaces/Routes.interface";

class App {
  public app: express.Application;
  public routes: Routes[];
  public host: string;
  public port: number;
  private server: http.Server;

  constructor(routes: Routes[]) {
    this.app = express();
    this.routes = routes;
    this.host = HOST || "localhost";
    this.port = Number(PORT) || 9000;
    this.server = http.createServer(this.app);

    this.initializeRoutes(this.routes);
  }

  listen() {
    this.server.listen(this.port, () => {
      console.log("======================================================");
      console.log(`🚀 Server is running on http://${this.host}:${this.port}`);
      console.log("======================================================");
    });
  }

  public getServer() {
    return this.app;
  }

  private initializeRoutes(routes: Routes[]) {
    routes.forEach((route) => {
      this.app.use(route.router);
    });
  }
}

export default App;
