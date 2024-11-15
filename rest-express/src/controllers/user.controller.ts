import { Request, Response } from "express";
import fs from "fs";
import { IUserId } from "../types/userId";

export class UserController {
  getUsers(req: Request, res: Response) {
    const users: IUserId[] = JSON.parse(
      fs.readFileSync("./db/users.json", "utf-8")
    );
    res.status(200).send({ users });
  }
  getUserId(req: Request, res: Response) {
    const { id } = req.params;
    const users: IUserId[] = JSON.parse(
      fs.readFileSync("./db/users.json", "utf-8")
    );
    const data = users.find((item) => item.id == id);
    if (data) {
      res.status(200).send({ user: data });
    } else {
      res.status(400).send({ message: "User not found!" });
    }
  }
  addUser(req: Request, res: Response) {
    const users: IUserId[] = JSON.parse(
      fs.readFileSync("./db/users.json", "utf-8")
    );
    const id = String(Math.max(...users.map((item) => parseInt(item.id))) + 1);
    const { name, email, password } = req.body;
    const newData: IUserId = { id, name, email, password };
    users.push(newData);
    fs.writeFileSync("./db/users.json", JSON.stringify(users), "utf-8")
    res.status(200).send({user:newData});
  }
}
