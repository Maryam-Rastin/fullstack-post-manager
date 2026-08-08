import express, { Express } from "express";
import cors from "cors";
import "dotenv/config";
import createRouter from "./routes";

const app: Express = express();
const port: number = 3001;
const router = createRouter();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cors({ credentials: false }));
// baseURL/api/
app.use("/api", router);

app.listen(port, () => {
  console.log(`server is running on port: ${port}`);
});
