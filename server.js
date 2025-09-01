import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import userRoutes from "./routes/userRoutes.js";
import cors from 'cors'

dotenv.config();
const app = express();

app.use(express.json());


const allowedOrigins = new Set([
  "http://localhost:3000",
  "http://localhost:3000/",
  "http://localhost:5173",
  "https://dailynewzmail.com/",
  "https://dailynewzmail.com"

]);

// CORS middleware setup
app.use(
  cors({
    origin: (origin, callback) => {
      // If origin is undefined (like Postman or curl), allow it
      
      if (!origin || allowedOrigins.has(origin)) {
        callback(null, true);
        // console.log("Origin:", origin);
      } else {
        console.warn("Blocked CORS request from:", origin);
        callback(new Error("CORS not allowed for this origin"));
      }
    },
    credentials: true, // Allows cookies and session headers
  })
);
// Routes
app.use("/api/users", userRoutes);

// MongoDB connection
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log("✅ MongoDB Connected"))
.catch((err) => console.error("❌ MongoDB Connection Error:", err));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
