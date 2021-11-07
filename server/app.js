const express = require("express");
const cors = require("cors");
const app = express();
const mongoose = require("mongoose");
const dotenv = require("dotenv");
dotenv.config({ path: "./config.env" });
const port = process.env.PORT;

require("./db/conn");

app.use(cors());
app.use(express.json());
//route middleware
app.use(require("./router/auth"));

// Available routes
app.use("/api/v1/auth", require("./router/auth"));
app.use("/api/v1/tasks", require("./router/tasks"));

// listen port
app.listen(port, () => {
  console.log(`lisenting in port ${port}`);
});
