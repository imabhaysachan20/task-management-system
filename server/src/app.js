const express = require("express");
const cors = require("cors")
const mongoose = require("mongoose")
require("dotenv").config()
const authRoutes = require("./routes/authRoutes")
const taskRoutes = require("./routes/taskRoutes");


const app = express();
app.use(cors())
app.use(express.json())


app.use("/api/auth", authRoutes)
app.use("/api/tasks", taskRoutes);

const PORT = process.env.PORT || 3000

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    app.listen(PORT, () => console.log(`Server running on ${PORT}`))
  })
  .catch((err) => console.error("MongoDB connection error", err))