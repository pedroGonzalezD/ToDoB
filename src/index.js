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
import { FRONTEND_URL, MONGODB_URI_STRING } from "./config.js";

const mongoURI = MONGODB_URI_STRING;
mongoose
  .connect(mongoURI)
  .then(() => console.log("conectato a mongoDB"))
  .catch((err) => console.log("error al conectar a mongoDB", err));

const app = express();
app.use(cookieParser());
// const port = 5000;

app.use(
  cors({
    origin: FRONTEND_URL,
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

export default app;

// app.listen(port, () => {
//   console.log(`servidor escuchando el puerto ${port}`);
// });
