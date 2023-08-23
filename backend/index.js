require("dotenv").config();
const fs = require("fs");

//import dependancies
const express = require("express");
const cookieParser = require("cookie-parser");
const mongoose = require("mongoose");
const cors = require("cors");
const morgan = require("morgan");
const fileUploads = require("express-fileupload");
const path = require("path");

const { frontend_url } = require("./utils");

//import routes
const userRoutes = require("./routes/users.routes");
const postRoutes = require("./routes/posts.routes");
const recipientRoutes = require("./routes/recipient.routes");
const urlRoutes = require("./routes/urls.routes");

// register express app
const app = express();

//middleware
app.use(express.json({ limit: "50mb" }));
app.use(
  express.urlencoded({ extended: true, limit: "50mb", parameterLimit: 50000 })
);
app.use(cookieParser());
app.use(morgan("dev"));
app.use(
  cors({
    origin: frontend_url,
    credentials: true,
  })
);

// middleware for file upload (check if the temp folder exists or create one first)
const temporaryDirectory =
  process.env.NODE_ENV === "development"
    ? path.join(__dirname, "ptm-uploads")
    : path.join("/tmp");

app.use(
  fileUploads({
    useTempFiles: true,
    tempFileDir: temporaryDirectory
  })
);

//connect to database and listen to app
const port = process.env.PORT || 8000;

mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => {
    app.listen(port, () =>
      console.log(`connected to db and listening on port ${port}`)
    );
  })
  .catch((err) => {
    console.log(err);
  });

// api custom middleware
app.use("/api/auth", userRoutes);
app.use("/api/auth/posts", postRoutes);
app.use("/api/recipient", recipientRoutes);
app.use('/api/user/urls', urlRoutes);

//redirect when route isn't found
app.use("*", (req, res) => res.status(404).redirect(frontend_url));
