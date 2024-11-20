import { Router } from "express";
import { DataController } from "../controllers/user.controller";
import { DataMiddleware } from "../middlewares/user.middleware";

export class UserRouter {
  private router: Router;
  private dataController: DataController;
  private dataMiddleware: DataMiddleware

  constructor() {
    this.dataController = new DataController();
    this.dataMiddleware = new DataMiddleware();
    this.router = Router();
    this.initializeRoutes()
  }

  private initializeRoutes() {
    this.router.get("/", this.dataController.getData);
    this.router.post("/", this.dataController.addData)
    this.router.get("/:id", this.dataMiddleware.checkId, this.dataController.getDataId)
    this.router.patch("/:id", this.dataMiddleware.checkId, this.dataController.editData)
    this.router.delete("/:id", this.dataMiddleware.checkId, this.dataController.deleteData)
    this.router.get(
      "/total/date-range",
      this.dataMiddleware.checkDateRange,
      this.dataController.getTotalByDateRange,
    );

    this.router.get(
      "/total/category/:category",
      this.dataController.getTotalByCategory
    );
  }

  getRouter(): Router{
    return this.router
  }
}