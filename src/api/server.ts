import App from ".";
import http from "http";
import { routes } from "./routes";
import { NODE_ENV, PORT } from "../../env";

class Server {
  private app = new App(routes);
  private port = PORT;
  private server = http.createServer(this.app.getApp());

  public start() {
    this.server.listen(this.port, async () => {
      console.log(`⚡${NODE_ENV} server started on port ${this.port}⚡`);
    });
  }
}

new Server().start();
