import User from "../models/user.js";
import jwt from "jsonwebtoken";
import { JWT_SECRET, REFRESH_TOKEN_SECRET } from "../config.js";
import Token from "../models/token.js";

export const registerUser = async (req, res) => {
  const { username, password, confirmPassword } = req.body;

  if (password !== confirmPassword) {
    return res.status(400).send("password do not match");
  }

  console.log(username);
  try {
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.status(400).send("The username is already in use");
    }

    const hashed = await User.hashPassword(password);
    console.log(hashed);
    const newUser = new User({ username, password: hashed });
    console.log(newUser);
    await newUser.save();

    res.status(201).send("User registered successfully");
  } catch (err) {
    console.log(err);
    res.status(500).send("Error registering user");
  }
};

export const loginUser = async (req, res) => {
  const { username, password } = req.body;

  try {
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(400).send("Incorrect username or password");
    }

    const isValid = await User.comparePassword(password, user.password);
    if (!isValid) {
      return res.status(400).send("Incorrect username or password");
    }

    const accessToken = jwt.sign(
      { id: user._id, username: user.username },
      JWT_SECRET,
      {
        expiresIn: "15m",
        algorithm: "HS256",
      }
    );

    const refreshToken = jwt.sign({ id: user._id }, REFRESH_TOKEN_SECRET, {
      expiresIn: "1d",
      algorithm: "HS256",
    });

    await new Token({ token: refreshToken }).save();

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: "None",
      maxAge: 24 * 60 * 60 * 1000,
    });

    res.status(200).json({ user: user.username, id: user._id, accessToken });
  } catch (err) {
    console.error("Error logging in", err);
    res.status(500).send("Error logging in");
  }
};
