import "./config/env.js";
import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import { errorMiddleware } from "./middlewares/error.middleware.js";
import dbConnect from "./config/db.js";
import { authRouter } from "./routes/authRoutes.js";
import userRouter from "./routes/userRoutes.js";

const app = express();

app.set("trust proxy", 1);

app.use(
  cors({
    origin: process.env.CORS_ORIGIN || "http://localhost:5173",
    credentials: true,
  }),
);

// Request Parsing Middlewares
app.use(express.json({ limit: "16kb" })); // Added limit to prevent DOS attacks
app.use(express.urlencoded({ extended: true, limit: "16kb" }));
app.use(express.static("public"));
app.use(cookieParser());

// API Endpoints
app.get("/", (req, res) => {
  res.send("Auth system working");
});

app.use("/api/auth", authRouter);
app.use("/api/user", userRouter);

// Global Error Middleware (MUST be after routes)
app.use(errorMiddleware);

const PORT = process.env.PORT || 4000;

dbConnect()
  .then(() => {
    return app.listen(PORT, () => {
      console.log(`⚙️  Server is running at port : ${PORT}`);
    });
  })
  .catch((err) => {
    console.error("MONGO db connection failed !!! ", err);
  });
