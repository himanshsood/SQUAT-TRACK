const express = require("express");
const app = express();
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const authRoute = require("./routes/auth");
const userRoute = require("./routes/users");
const postRoute = require("./routes/posts");

const contactRoute=require("./routes/contact")
const downloadPost = require("./routes/downloadPost")
const multer = require("multer");
const path = require("path");
const connectDb=require("./config/dbConnection")
const cors = require("cors");

dotenv.config();


app.use(express.json()); // It reads the Content-Type header of incoming requests. If the Content-Type is application/json, it parses the JSON data in the request body.
app.use("/images", express.static(path.join(__dirname, "/images")));
app.use(cors());


connectDb()


const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "images");
  },
  filename: (req, file, cb) => {
    cb(null, req.body.name);
  },
});

const upload = multer({ storage: storage });
app.post("/api/upload", upload.single("file"), (req, res) => {
  res.status(200).json("File has been uploaded");
});

app.use("/api/auth", authRoute);
app.use("/api/users", userRoute);
app.use("/api/posts", postRoute);

app.use("/api/contact",contactRoute)
app.use("/api/download-post",downloadPost)

app.listen("5000", () => {
  console.log("Backend is running.");
});