import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
const app = express();

app.get("/", (req, res) => {
  res.send("Hello World from Backend");
});

app.use(cors());
app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));
app.use(cookieParser());
app.use(cookieParser());

import userRoutes from "./routes/user.routes.js";
import taskRoutes from "./routes/task.routes.js";

app.use("/api/v1/task", taskRoutes);
app.use("/api/v1/user", userRoutes);

export { app };
