import "dotenv/config";
import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import { errorMiddleware } from "./middlewares/error.middleware.js";
import dbConnect from "./config/db.js";

const app = express();


app.use(
  cors({
    origin: process.env.CORS_ORIGIN || "http://localhost:3000",
    credentials: true,
  })
);

// Request Parsing Middlewares
app.use(express.json({ limit: "16kb" })); // Added limit to prevent DOS attacks
app.use(express.urlencoded({ extended: true, limit: "16kb" }));
app.use(express.static("public"));
app.use(cookieParser());

// Routes
app.get("/", (req, res) => {
  res.send("Auth system working");
});

// Import and use your actual routes here


// Global Error Middleware (MUST be after routes)
app.use(errorMiddleware);

const PORT = process.env.PORT || 4000; 

dbConnect()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`⚙️  Server is running at port : ${PORT}`);
    });
  })
  .catch((err) => {
    console.log("MONGO db connection failed !!! ", err);
  });
