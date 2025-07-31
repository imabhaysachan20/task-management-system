import { useState } from "react";
import API from "@/lib/axios";
import { Input } from "./ui/input";
import { Button } from "./ui/button";

export default function TaskForm({ onTaskCreated }) {
  const [title, setTitle] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await API.post("/tasks", { title });
      setTitle("");
      onTaskCreated();
    } catch {
      alert("Failed to create task");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex gap-2">
      <Input
        placeholder="Task title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        required
      />
      <Button type="submit">Add Task</Button>
    </form>
  );
}
