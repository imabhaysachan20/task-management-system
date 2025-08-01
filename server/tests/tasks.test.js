require("./setup");
const request = require("supertest");
const app = require("../src/app");
const Task = require("../src/models/Task");
const User = require("../src/models/User");
const jwt = require("jsonwebtoken");

describe("Tasks API", () => {
  let userToken, adminToken, userId, adminId;

  beforeEach(async () => {
    // Create test users
    const user = await User.create({
      email: "user@example.com",
      password: "password123",
      role: "user"
    });
    userId = user._id;
    userToken = jwt.sign({ userId: user._id, role: "user" }, process.env.JWT_SECRET);

    const admin = await User.create({
      email: "admin@example.com",
      password: "password123",
      role: "admin"
    });
    adminId = admin._id;
    adminToken = jwt.sign({ userId: admin._id, role: "admin" }, process.env.JWT_SECRET);
  });

  describe("POST /api/tasks", () => {
    it("should create a task as admin", async () => {
      const taskData = {
        title: "Test Task",
        description: "Test Description",
        priority: "high",
        status: "todo",
        dueDate: new Date().toISOString(),
        assignedTo: userId.toString()
      };

      const response = await request(app)
        .post("/api/tasks")
        .set("Authorization", `Bearer ${adminToken}`)
        .send(taskData)
        .expect(201);

      expect(response.body.title).toBe(taskData.title);
      expect(response.body.assignedTo).toBe(taskData.assignedTo);
      expect(response.body.createdBy).toBe(adminId.toString());
    });

    it("should create a self-assigned task as user", async () => {
      const taskData = {
        title: "User Task",
        description: "Test Description",
        priority: "medium",
        status: "todo",
        dueDate: new Date().toISOString()
      };

      const response = await request(app)
        .post("/api/tasks")
        .set("Authorization", `Bearer ${userToken}`)
        .send(taskData)
        .expect(201);

      expect(response.body.title).toBe(taskData.title);
      expect(response.body.assignedTo).toBe(userId.toString());
      expect(response.body.createdBy).toBe(userId.toString());
    });
  });

  describe("GET /api/tasks", () => {
    beforeEach(async () => {
      // Create test tasks
      const tasks = [
        {
          title: "Task 1",
          description: "Description 1",
          priority: "high",
          status: "todo",
          dueDate: new Date(),
          assignedTo: userId,
          createdBy: adminId
        },
        {
          title: "Task 2",
          description: "Description 2",
          priority: "low",
          status: "done",
          dueDate: new Date(),
          assignedTo: userId,
          createdBy: adminId
        }
      ];
      await Task.insertMany(tasks);
    });

    it("should get all tasks as admin", async () => {
      const response = await request(app)
        .get("/api/tasks")
        .set("Authorization", `Bearer ${adminToken}`)
        .expect(200);

      expect(response.body.tasks).toHaveLength(2);
      expect(response.body.total).toBe(2);
    });

    it("should get only assigned tasks as user", async () => {
      const response = await request(app)
        .get("/api/tasks")
        .set("Authorization", `Bearer ${userToken}`)
        .expect(200);

      expect(response.body.tasks).toHaveLength(2);
      expect(response.body.tasks.every(task => task.assignedTo._id === userId.toString())).toBe(true);
    });

    it("should filter tasks by status", async () => {
      const response = await request(app)
        .get("/api/tasks")
        .query({ status: "done" })
        .set("Authorization", `Bearer ${adminToken}`)
        .expect(200);

      expect(response.body.tasks).toHaveLength(1);
      expect(response.body.tasks[0].status).toBe("done");
    });

    it("should filter tasks by priority", async () => {
      const response = await request(app)
        .get("/api/tasks")
        .query({ priority: "high" })
        .set("Authorization", `Bearer ${adminToken}`)
        .expect(200);

      expect(response.body.tasks).toHaveLength(1);
      expect(response.body.tasks[0].priority).toBe("high");
    });

    it("should paginate results", async () => {
      const response = await request(app)
        .get("/api/tasks")
        .query({ page: 1, limit: 1 })
        .set("Authorization", `Bearer ${adminToken}`)
        .expect(200);

      expect(response.body.tasks).toHaveLength(1);
      expect(response.body.total).toBe(2);
      expect(response.body.page).toBe(1);
      expect(response.body.limit).toBe(1);
    });
  });
});
