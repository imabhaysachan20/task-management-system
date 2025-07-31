const Task = require("../models/Task");


exports.createTask = async (req, res) => {
  try {
    const task = await Task.create({
      ...req.body,
      createdBy: req.user.userId,
    });
    res.status(201).json(task);
  } catch (err) {
    res.status(400).json({ error: "Could not create task" });
  }
};


exports.getTasks = async (req, res) => {
  try {
    const tasks = await Task.find({ createdBy: req.user.userId });
    res.json(tasks);
  } catch (err) {
    res.status(500).json({ error: "Could not fetch tasks" });
  }
};


exports.getTaskById = async (req, res) => {
  try {
    const task = await Task.findOne({
      _id: req.params.id,
      createdBy: req.user.userId,
    });
    if (!task) return res.status(404).json({ error: "Not found" });
    res.json(task);
  } catch (err) {
    res.status(500).json({ error: "Could not get task" });
  }
};


exports.updateTask = async (req, res) => {
  try {
    const task = await Task.findOneAndUpdate(
      { _id: req.params.id, createdBy: req.user.userId },
      req.body,
      { new: true }
    );
    if (!task) return res.status(404).json({ error: "Not found" });
    res.json(task);
  } catch (err) {
    res.status(500).json({ error: "Could not update task" });
  }
};


exports.deleteTask = async (req, res) => {
  try {
    const task = await Task.findOneAndDelete({
      _id: req.params.id,
      createdBy: req.user.userId,
    });
    if (!task) return res.status(404).json({ error: "Not found" });
    res.json({ message: "Task deleted" });
  } catch (err) {
    res.status(500).json({ error: "Could not delete task" });
  }
};
