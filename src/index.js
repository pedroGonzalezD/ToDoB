import express from "express";
import mongoose from "mongoose";
import userRoutes from "./routes/userRoutes.js";
import todoRoutes from "./routes/todoRoutes.js";
import cors from "cors";
import cookieParser from "cookie-parser";
import {
  refreshAccessToken,
  authenticateToken,
} from "./middleware/authenticateToken.js";
import { logout } from "./controllers/logoutController.js";
const mongoURI = "mongodb://localhost:27017/p1";
mongoose
  .connect(mongoURI)
  .then(() => console.log("conectato a mongoDB"))
  .catch((err) => console.log("error al conectar a mongoDB", err));

const app = express();
app.use(cookieParser());
const port = 5000;

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);

app.use(express.json());

app.get("/", (req, res) => {
  res.send("hola, mundo");
});

app.use("/api/", userRoutes);
app.post("/api/refresh-token", refreshAccessToken);
app.post("/api/logout", logout);

app.use(authenticateToken);
app.use("/api/", todoRoutes);

app.listen(port, () => {
  console.log(`servidor escuchando el puerto ${port}`);
});
