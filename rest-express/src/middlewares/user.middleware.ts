import { NextFunction, Request, Response } from "express";
import { IUserId } from "../types/userId";
import fs from "fs";

export class UserMiddleware {
  checkId(req: Request, res: Response, next: NextFunction) {
    const { id } = req.params;
    const users: IUserId[] = JSON.parse(
      fs.readFileSync("./db/users.json", "utf-8")
    );
    const data = users.find((item) => item.id == id);
    if (data) {
      next();
    } else {
      res.status(400).send({ message: "User not found!" });
    }
  }
}
