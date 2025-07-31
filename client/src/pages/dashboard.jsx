import { useEffect, useState } from "react";
import TaskList from "@/components/TaskList";
import TaskForm from "@/components/TaskForm";
import API from "@/lib/axios";

export default function Dashboard() {
  const [tasks, setTasks] = useState([]);

  const fetchTasks = async () => {
    try {
      const res = await API.get("/tasks");
      setTasks(res.data);
    } catch (err) {
      alert("Failed to fetch tasks");
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  return (
    <div className="max-w-3xl mx-auto mt-10 space-y-8">
      <TaskForm onTaskCreated={fetchTasks} />
      <TaskList tasks={tasks} onTaskDeleted={fetchTasks} />
    </div>
  );
}
