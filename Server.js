import express from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";
import cors from "cors";
import userRoutes from './routes/user.routes.js';
import questionRoutes from './routes/question.routes.js';
import quizRoutes from './routes/quiz.routes.js';
import resultRoutes from './routes/result.routes.js';


dotenv.config();
const app = express();

app.use(cors());
app.use(express.json());

app.listen(process.env.PORT, () => { 
    console.log(`Server running on port ${process.env.PORT}` );
});

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("MongoDB connected successfully");
  } catch (error) {
    console.log("Error connecting Database",error);
  }
};

connectDB();

app.use('/api/user',userRoutes);
app.use('/api/question',questionRoutes);
app.use('/api/quiz',quizRoutes);
app.use('/api/exam',resultRoutes);