import express, { Request, Response, Application } from "express";
import { UserRouter } from "./routers/user.router";
import cors from "cors"

const PORT: number = 8000;

const app: Application = express();
app.use(express.json())
app.use(cors())
const userRouter = new UserRouter


app.get("/api", (req: Request, res: Response) => {
  res.status(200).send("Hello, welcome to my API");
});

app.use("/api/users", userRouter.getRouter())

app.listen(PORT, () => {
  console.log(`server running on http://localhost:${PORT}`);
});
