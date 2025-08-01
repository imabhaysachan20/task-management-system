require("./setup");
const request = require("supertest");
const app = require("../src/app");
const User = require("../src/models/User");
const jwt = require("jsonwebtoken");

describe("User API", () => {
  let adminToken, adminId;

  beforeEach(async () => {
    // Create admin user
    const admin = await User.create({
      email: "admin@example.com",
      password: "password123",
      role: "admin"
    });
    
    adminId = admin._id;
    adminToken = jwt.sign(
      { userId: admin._id, role: "admin" },
      process.env.JWT_SECRET
    );
  });
  describe("POST /api/users", () => {
    it("should create a new user", async () => {
      const userData = {
        email: "test@example.com",
        password: "password123",
        role: "user"
      };

      const response = await request(app)
        .post("/api/users")
        .send(userData)
        .expect(201);

      expect(response.body.user.email).toBe(userData.email);
      expect(response.body.user.role).toBe(userData.role);
      expect(response.body.user.password).toBeUndefined();
      expect(response.body.message).toBe("User created");

      // Verify user was saved to database
      const user = await User.findOne({ email: userData.email });
      expect(user).toBeTruthy();
      expect(user.email).toBe(userData.email);
    });

    it("should not create user with existing email", async () => {
      const userData = {
        email: "duplicate@example.com",
        password: "password123",
        role: "user"
      };

      // Create first user
      await User.create(userData);

      // Try to create duplicate user
      const response = await request(app)
        .post("/api/users")
        .send(userData)
        .expect(400);

      expect(response.body.error).toBe("Email already in use");
    });
  });

  describe("GET /api/users", () => {
    beforeEach(async () => {
      // Create test users
      const users = Array.from({ length: 15 }, (_, i) => ({
        email: `user${i}@example.com`,
        password: "password123",
        role: "user"
      }));
      await User.insertMany(users);
    });

    it("should get paginated users", async () => {
      const response = await request(app)
        .get("/api/users")
        .query({ page: 1, limit: 10 })
        .expect(200);

      expect(response.body.users).toHaveLength(10);
      expect(response.body.currentPage).toBe(1);
      expect(response.body.totalPages).toBe(2);
      expect(response.body.totalUsers).toBe(15);
    });

    it("should get second page of users", async () => {
      const response = await request(app)
        .get("/api/users")
        .query({ page: 2, limit: 10 })
        .expect(200);

      expect(response.body.users).toHaveLength(5);
      expect(response.body.currentPage).toBe(2);
    });

    it("should return all users without pagination", async () => {
      const response = await request(app)
        .get("/api/users/all")
        .expect(200);

      expect(response.body).toHaveLength(15);
    });
  });
});