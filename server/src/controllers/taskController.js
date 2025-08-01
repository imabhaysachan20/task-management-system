const Task = require("../models/Task");


exports.createTask = async (req, res) => {
  try {
    const filePaths = req.files?.map((f) => {
  const fileName = f.filename || f.path.split("\\").pop();
  return `/uploads/${fileName}`;
}) || [];

    const task = await Task.create({
      ...req.body,
      assignedTo:(req.user.role==="admin"?req.body.assignedTo:req.user.userId),
      documents: filePaths,
      createdBy: req.user.userId,
    });

    res.status(201).json(task);
  } catch (err) {
    res.status(400).json({ error: "Could not create task" });
  }
};



exports.getTasks = async (req, res) => {
  try {
    const isAdmin = req.user.role === "admin";
    const { status, priority, dueDate, sortBy = "createdAt", order = "desc", page = 1, limit = 10 } = req.query;

    const query = isAdmin ? {} : { assignedTo: req.user.userId };

    if (status) query.status = status;
    if (priority) query.priority = priority;
    if (dueDate) query.dueDate = { $lte: new Date(dueDate) };

    const tasks = await Task.find(query)
      .sort({ [sortBy]: order === "asc" ? 1 : -1 })
      .skip((page - 1) * limit)
      .limit(Number(limit)).populate([
    { path: "createdBy", select: "email" },
    { path: "assignedTo", select: "email" }
  ]);

    const count = await Task.countDocuments(query);

    res.json({
      total: count,
      page: Number(page),
      limit: Number(limit),
      tasks,
    });
  } catch (err) {
    res.status(500).json({ error: "Could not fetch tasks" });
  }
};



exports.getTasksOfUser = async (req, res) => {
  try {
    // Verify admin status
    if (req.user.role !== "admin") {
      return res.status(403).json({ error: "Only admins can access other users' tasks" });
    }

    const { page = 1, limit = 10, status, sortBy = "createdAt", order = "desc" } = req.query;
    const userId = req.params.id;

    // Build query
    const query = { assignedTo: userId };
    if (status) query.status = status;

    // Get tasks with pagination and sorting
    const tasks = await Task.find(query)
      .populate([
        { path: "createdBy", select: "email" },
        { path: "assignedTo", select: "email" }
      ])
      .sort({ [sortBy]: order === "asc" ? 1 : -1 })
      .skip((Number(page) - 1) * Number(limit))
      .limit(Number(limit));

    // Get total count for pagination
    const total = await Task.countDocuments(query);

    res.json({
      tasks,
      currentPage: Number(page),
      totalPages: Math.ceil(total / Number(limit)),
      totalTasks: total
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Could not fetch user's tasks" });
  }
};

exports.getTaskById = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);

if (!task) return res.status(404).json({ error: "Not found" });

if (req.user.role !== "admin" && task.assignedTo.toString() !== req.user.userId) {
  return res.status(403).json({ error: "Forbidden" });
}
 
    res.json(task);
  } catch (err) {
    res.status(500).json({ error: "Could not get task" });
  }
};


exports.updateTask = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);

if (!task) return res.status(404).json({ error: "Not found" });

if (req.user.role !== "admin" && task.assignedTo.toString() !== req.user.userId) {
  return res.status(403).json({ error: "Forbidden" });
}

    const filePaths = req.files?.map((f) => {
  const fileName = f.filename || f.path.split("\\").pop(); // for Windows
  return `/uploads/${fileName}`;
}) || [];
    const updatedFields = {
      ...req.body,
      documents: [...(task.documents || []), ...filePaths].slice(0, 3)
    };

    const updated = await Task.findByIdAndUpdate(req.params.id, updatedFields, {
      new: true,
    });

    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: "Could not update task" });
  }
};

exports.deleteTask = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);

    if (!task) return res.status(404).json({ error: "Not found" });

    if (req.user.role !== "admin" && task.assignedTo.toString() !== req.user.userId) {
      return res.status(403).json({ error: "Forbidden" });
    }

    await task.deleteOne();
    res.json({ message: "Task deleted" });
  } catch (err) {
    res.status(500).json({ error: "Could not delete task" });
  }
};
