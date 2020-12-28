import express from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";
import cors from "cors";

// Routes
import userRouter from "./routes/User.js";

const app = express();
app.use(express.json());
app.use(cors());
dotenv.config();

const connection_url = process.env.MONGODB_CONNECTION_URL;
// const connection_url = process.env.MONGODB_LOCAL_CONNECTION_URL;
const port = process.env.PORT || 5000;

// Routes
app.use("/user", userRouter);

mongoose
  .connect(connection_url, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() =>
    app.listen(port, () => console.log(`Server is up on port: ${port}`))
  )
  .catch((error) => console.log(error));

mongoose.set("useFindAndModify", false);
