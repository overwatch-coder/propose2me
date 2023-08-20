require("dotenv").config();

//import dependancies
const express = require("express");
const cookieParser = require("cookie-parser");
const mongoose = require("mongoose");
const cors = require("cors");
const fileUploads = require("express-fileupload");

const {frontend_url} = require('./utils')

console.log(frontend_url);

//import routes
const userRoutes = require("./routes/users.routes");
const postRoutes = require("./routes/posts.routes");
const recipientRoutes = require("./routes/recipient.routes");

// register express app
const app = express();

//middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(cors());
app.use(
  fileUploads({ useTempFiles: true, tempFileDir: `${__dirname}/ptm-uploads` })
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

//redirect when route isn't found
app.use("*", (req, res) => res.status(404).redirect(frontend_url));
