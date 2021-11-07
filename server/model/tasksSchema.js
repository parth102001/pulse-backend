const mongoose = require("mongoose");

const tasksSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "USER",
  },
  title: {
    type: String,
    required: true,
  },
  hour: {
    type: Number,
    required: true,
  },
  date: {
    type: String,
    required: true,
  },
  status: {
    type: Boolean,
    default: false,
  },
  timeStamp: {
    type: Date,
    default: Date.now,
  },
});

const Task = mongoose.model("TASK", tasksSchema);
module.exports = Task;
