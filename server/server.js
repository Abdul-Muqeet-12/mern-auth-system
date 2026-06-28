import express from "express";
import cors from "cors";
import "dotenv/config";
import cookieParser from "cookie-parser";

const app = express();
const port = process.env.PROT || 4000;

app.get("/", (req, res) => {
  res.send("MERN Authentication API is running...");
});

app.listen(port, () => {
  console.log(`Server strated on PORT:${port}`);
});
