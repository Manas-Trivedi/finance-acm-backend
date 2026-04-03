import express from "express";
import authRoutes from "./routes/authRoutes.js"
import recordRoutes from "./routes/recordRoutes.js"
import dashboardRoutes from "./routes/dashboardRoutes.js"

const app = express();

app.use(express.json());

app.use("/auth", authRoutes);
app.use("/records", recordRoutes);
app.use("/dashboard", dashboardRoutes);

export default app;