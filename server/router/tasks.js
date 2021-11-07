const express = require("express");
// const mongoose = require("mongoose");
const router = express.Router();
const fetchuser = require("../middleware/fetchuser");
const Task = require("../model/tasksSchema");
const { body, validationResult } = require("express-validator");

// Route 1: Get all the tasks using: GET "/api/v1/tasks/getuser". Login required
router.get("/fetchalltasks", fetchuser, async (req, res) => {
  try {
    const tasks = await Task.find({ user: req.user.id });
    res.json(tasks);
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
});

// Route 2: Add a new task using: POST "/api/v1/tasks/getuser". Login required
router.post(
  "/addtask",
  fetchuser,
  [
    body("title", "Enter a valid title").isLength({ min: 5 }),
    body("hour", "Enter a valid time").isLength({ min: 1 }),
  ],
  async (req, res) => {
    try {
      const { hour, title, date, status } = req.body;
      //  if there are errors, return Bad request and the errors
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const task = new Task({
        title,
        hour,
        date,
        user: req.user.id,
      });
      const savedTask = await task.save();
      res.status(201).json({ message: "successfull", savedTask });
    } catch (error) {
      console.log(error);
      res.status(500).json({ error: "Internal server error" });
    }
  }
);

// Route 3: Update an existing task using: Put "/api/v1/tasks/updatenote". Login required
router.put("/updatenote/:id", fetchuser, async (req, res) => {
  try {
    const { status } = req.body;
    let newTask = {};
    if (!status) {
      newTask.status = true;
      console.log(status);
    }
    let task = await Task.findById(req.params.id);
    if (!task) {
      return res.status(404).send("Not found");
    }
    if (task.user.toString() !== req.user.id) {
      return res.status(401).send("Not Allowed");
    }
    task = await Task.findByIdAndUpdate(req.params.id, { $set: newTask });
    res.json({ task });
  } catch (error) {
    res.status(500).json(error);
  }
});
module.exports = router;
