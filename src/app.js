import express from "express";
import authRoutes from "./routes/authRoutes.js"
import recordRoutes from "./routes/recordRoutes.js"
import { record } from "zod";

const app = express();

app.use(express.json());

app.use("/auth", authRoutes);
app.use("/records", recordRoutes);

export default app;