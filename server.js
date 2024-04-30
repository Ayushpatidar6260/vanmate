import express from "express";

import mongoose from "mongoose";

import router from "./routes/routes.js";

const app = express();

const port = 4000;

app.use(express.json());

app.use("/", router);

mongoose
  .connect("mongodb://127.0.0.1:27017/Vanmate")
  .then(() => {
    console.log("mongodb connected");
  })
  .catch((error) => {
    console.log("connection failed", error);
  });

app.listen(port, () => {
  console.log(`server is statrted on http://localhost:${port}`);
});
