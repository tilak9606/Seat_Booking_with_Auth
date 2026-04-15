import express from "express";
import seatsRouter from "./src/modules/seats/seats.routes.js";
import authRouter from "./src/modules/auth/auth.routes.js";
import { dirname, join } from "path";
import { fileURLToPath } from "url";
import cookieParser from "cookie-parser";


export function createApplication() {
  
  const app = express();

  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
  app.use(cookieParser());
  const __dirname = dirname(fileURLToPath(import.meta.url));
  app.use("/seats", seatsRouter);
  app.use("/auth", authRouter);

 app.use(express.static(join(__dirname)));

  app.get("/login", (req, res) => {
    res.sendFile(join(__dirname, "src/Pages/Login.html"));
  });

  app.get("/signup", (req, res) => {
    res.sendFile(join(__dirname, "src/Pages/Signup.html"));
  });

  app.get("/me", (req, res) => {
    res.sendFile(join(__dirname, "src/Pages/Profile.html"));
  });

  app.get("/forgot-password", (req, res) => {
    res.sendFile(join(__dirname, "src/Pages/forgot-password.html"));
  });

  app.get("/reset-password/:token", (req, res) => {
    res.sendFile(join(__dirname, "src/Pages/reset-password.html"));
  });

  app.get("/", (req, res) => {
    res.sendFile(join(__dirname, "src/Pages/index.html"));
  });

  app.use((err, req, res, next) => {
    console.error("Error:", err);

    const statusCode = err.statusCode || 500;
    const message = err.message || "Internal Server Error";

    res.status(statusCode).json({
      success: false,
      error: message,
    });
  });
  
  app.use((req, res) => {
    res.status(404).json({ error: `${req.url} not found` });
  });

  return app;
}
