import Token from "../models/token.js";

export const logout = async (req, res) => {
  try {
    const refreshToken = req.cookies?.refreshToken; // Obtener el refresh token desde las cookies

    if (!refreshToken) {
      return res.status(204).json({ message: "No token found" }); // Sin contenido si no hay refresh token
    }

    // Eliminar el refresh token de la base de datos
    await Token.findOneAndDelete({ token: refreshToken });

    // Limpiar la cookie del refresh token
    res.clearCookie("refreshToken", {
      httpOnly: true,
      secure: true,
      sameSite: "None",
    });

    return res.status(200).json({ message: "Logout successful" });
  } catch (error) {
    console.error("Error al hacer logout:", error);
    return res.status(500).json({ message: "Error during logout" });
  }
};
