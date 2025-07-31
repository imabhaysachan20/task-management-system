const express = require("express");
const router = express.Router();
const {authMiddleware, adminAuthMiddleware} = require("../middleware/authMiddleware");
const {
  createTask,
  getTasks,
  getTaskById,
  updateTask,
  deleteTask,
} = require("../controllers/taskController");

router.use(authMiddleware);

router.post("/", adminAuthMiddleware, createTask);
router.get("/", getTasks);
router.get("/:id", getTaskById);
router.patch("/:id", updateTask);
router.delete("/:id", adminAuthMiddleware, deleteTask);

module.exports = router;
