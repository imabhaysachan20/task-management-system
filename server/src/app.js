const express = require("express");
const cors = require("cors")
const mongoose = require("mongoose")
require("dotenv").config()
const authRoutes = require("./routes/authRoutes")
const taskRoutes = require("./routes/taskRoutes");
const userRoutes = require("./routes/userRoutes");


const app = express();
app.use(cors())
app.use(express.json())


app.get("/health",(req,res)=>{
  res.json("working!")
})

app.use("/uploads", express.static("uploads"));
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/tasks", taskRoutes);



const PORT = process.env.PORT || 3000

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    app.listen(PORT, () => console.log(`Server running on ${PORT}`))
  })
  .catch((err) => console.error("MongoDB connection error", err))