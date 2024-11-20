import { NextFunction, Request, Response } from "express";
import { IData } from "../types/data";
import fs from "fs";

export class DataMiddleware {
  checkId(req: Request, res: Response, next: NextFunction): void {
    const { id } = req.params;
    const data: IData[] = JSON.parse(fs.readFileSync("./db/data.json", "utf-8"));
    const resultId = data.find((item) => item.id == id);

    if (!resultId) {
      res.status(400).json({ message: "Data not found" });
      return;
    }
    next();
  }

  checkDateRange(req: Request, res: Response, next: NextFunction): void {
    const { startDate, endDate } = req.query;

    if (!startDate || !endDate) {
      res.status(400).json({ message: "Missing startDate or endDate" });
      return;
    }

    const isValidStartDate = !isNaN(new Date(startDate as string).getTime());
    const isValidEndDate = !isNaN(new Date(endDate as string).getTime());

    if (!isValidStartDate || !isValidEndDate) {
      res.status(400).json({ message: "Invalid date format" });
      return;
    }
    next();
  }
}
