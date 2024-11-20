import { Router } from "express";
import { ExpenseV2Controller } from "../controllers/expensev2.controller";

export class ExpenseV2Router {
  private router: Router;
  private expensev2Controller: ExpenseV2Controller;

  constructor() {
    this.router = Router();
    this.expensev2Controller = new ExpenseV2Controller();
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.get("/", this.expensev2Controller.getExpense);
    this.router.get("/:id",this.expensev2Controller.getExpenseById)
  }

  getRouter(): Router {
    return this.router;
  }
}