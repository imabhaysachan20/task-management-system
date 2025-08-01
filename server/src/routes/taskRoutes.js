const express = require("express");
const router = express.Router();
const upload = require("../middleware/uploadMiddleware");
const {authMiddleware, adminAuthMiddleware} = require("../middleware/authMiddleware");
const {
  createTask,
  getTasks,
  getTaskById,
  updateTask,
  deleteTask,
  getTasksOfUser,
} = require("../controllers/taskController");

router.use(authMiddleware);

router.post("/", upload.array("documents", 3), createTask);
router.get("/", getTasks);
router.get("/user/:id", getTasksOfUser);
router.get("/:id", getTaskById);
router.patch("/:id", upload.array("documents", 3), updateTask);
router.delete("/:id", deleteTask);

module.exports = router;
