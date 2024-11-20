import { Request, Response } from "express";
import fs from "fs";
import { IData } from "../types/data";

export class DataController {
  getData(req: Request, res: Response) {
    let data: IData[] = JSON.parse(
      fs.readFileSync("./db/data.json", "utf-8")
    );
    res.status(200).send({ data });
  }
  getDataId(req: Request, res: Response) {
    const { id } = req.params;
    const data: IData[] = JSON.parse(
      fs.readFileSync("./db/data.json", "utf-8")
    );
    const resultId = data.find((item) => item.id == id);
    res.status(200).send({ user: resultId });
  }
  addData(req: Request, res: Response) {
    const data: IData[] = JSON.parse(
      fs.readFileSync("./db/data.json", "utf-8")
    );
    const id = String(Math.max(...data.map((item) => parseInt(item.id))) + 1);
    const { title, amount, type, category, date } = req.body;
    const newData: IData = { id, title, amount, type, category, date };
    data.push(newData);

    fs.writeFileSync("./db/data.json", JSON.stringify(data), "utf-8");

    res.status(201).send({ user: newData });
  }
  editData(req: Request, res: Response) {
    const { id } = req.params;
    const data: IData[] = JSON.parse(
      fs.readFileSync("./db/data.json", "utf-8")
    );
    const idx: number = data.findIndex((item) => item.id == id);
    data[idx] = { ...data[idx], ...req.body };
    fs.writeFileSync("./db/data.json", JSON.stringify(data), "utf-8");

    res.status(200).send("edit sucsessfully!");
  }
  deleteData(req: Request, res: Response) {
    const { id } = req.params;
    const data: IData[] = JSON.parse(
      fs.readFileSync("./db/data.json", "utf-8")
    );
    const newUsers = data.filter((item) => item.id != id);
    fs.writeFileSync("./db/data.json", JSON.stringify(newUsers), "utf-8");
    res.status(200).send("Delete Successfuly!");
  }
  getTotalByDateRange(req: Request, res: Response): void {
    const { startDate, endDate } = req.query;
    const data: IData[] = JSON.parse(fs.readFileSync("./db/data.json", "utf-8"));

    if (!startDate || !endDate) {
      res.status(400).json({ error: "Missing startDate or endDate" });
      return;
    }

    const total = data.reduce((sum, item) => {
      const isWithinRange =
        new Date(item.date) >= new Date(startDate as string) &&
        new Date(item.date) <= new Date(endDate as string);

      return isWithinRange && item.type === "expense" ? sum + item.amount : sum;
    }, 0);

    res.json({ total });
  }
  getTotalByCategory(req: Request, res: Response) {
    const { category } = req.params;
    const { type } = req.query
    const data: IData[] = JSON.parse(
      fs.readFileSync("./db/data.json", "utf-8")
    );

    const total = data
      .filter(
        (item) =>
          item.category.toLowerCase() === category.toLowerCase() &&
          item.type === type
      )
      .reduce((acc, curr) => acc + curr.amount, 0);

    res.status(200).send({ total });
  }
}
