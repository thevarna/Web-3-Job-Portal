import express from "express";
import cors from "cors";
import providerRouter from "./router/provider";
import developerRouter from "./router/developer";

const app = express();

app.use(cors());
app.use(express.json());
app.use("/v1/provider", providerRouter);
app.use("/v1/developer", developerRouter);

app.listen(3002, () => {
  console.log("Server is running on port 3002");
});
