import jwt from "jsonwebtoken";
import { JWT_SECRET, REFRESH_TOKEN_SECRET } from "../config.js";
import User from "../models/user.js";
import Token from "../models/token.js";

export const refreshAccessToken = async (req, res) => {
  const refreshToken = req.cookies.refreshToken;

  if (!refreshToken) {
    return res.status(401).send("No refresh token found");
  }

  const found = await Token.findOne({ token: refreshToken });
  if (!found) {
    return res.status(403).send("Invalid refresh token");
  }

  // Verificar el refresh token y recuperar el id del usuario asociado
  jwt.verify(refreshToken, REFRESH_TOKEN_SECRET, async (err, decoded) => {
    if (err) {
      return res.status(403).send("Invalid refresh token");
    }

    // Recuperar el usuario de la base de datos usando el id del token
    const user = await User.findById(decoded.id);
    if (!user) {
      return res.status(404).send("User not found");
    }

    const newAccessToken = jwt.sign(
      { id: user._id, username: user.username }, // Ahora sí tienes acceso a ambos
      JWT_SECRET,
      { expiresIn: "15m" }
    );

    res.json({
      user: user.username,
      id: user._id,
      newAccessToken: newAccessToken,
    });
  });
};

export const authenticateToken = (req, res, next) => {
  // Extraer el token del header 'Authorization'
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1]; // Si hay authHeader, extrae el token

  if (!token) {
    return res.status(401).send("Access token not provided");
  }

  // Verificar el access token
  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).send("Invalid access token");
    }

    // Si es válido, asigna los datos del usuario al request para usarlos en las siguientes rutas
    req.user = user;
    next(); // Continúa con la siguiente función
  });
};
