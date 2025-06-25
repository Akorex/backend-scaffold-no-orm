import express from "express";
import { Express, Request, Response, NextFunction } from "express";
import cors from "cors";
import { Routes } from "./route.interface";
import { notFoundHandler, errorHandler } from "./errorhandlers/error.handler";

class App {
  public app: Express;

  constructor(routes: Routes) {
    this.app = express();
    this.initDB();
    this.initMiddlewares();
    this.initRoutes(routes);
    this.initErrorHandlers();
  }

  public getApp() {
    return this.app;
  }

  private initMiddlewares() {
    this.app.use(cors());
    this.app.use((req: Request, res: Response, next: NextFunction) => {
      res.header("Access-Control-Allow-Origin", "*");
      res.header(
        "Access-Control-Allow-Methods",
        "GET, POST, PUT, DELETE, OPTIONS"
      );
      res.header(
        "Access-Control-Allow-Headers",
        "Origin, X-Requested-With, Content-Type, Accept, Authorization"
      );
      res.setHeader("Access-Control-Allow-Credentials", "true");
      next();
    });

    this.app.use(express.urlencoded({ extended: true }));
    this.app.use(express.json({ limit: "25mb" }));
  }

  private initRoutes(routes: Routes) {
    routes.forEach((route) => {
      this.app.use(`/api/v1/${route.path}`, route.router);
    });
  }

  private initErrorHandlers() {
    this.app.use(notFoundHandler);
    this.app.use(errorHandler);
  }

  private async initDB() {
    try {
      // code to install db
      console.log("Database connection established");
    } catch (error) {
      console.log("Database connection failed");
      console.error(error);
      process.exit(1);
    }
  }
}

export default App;
