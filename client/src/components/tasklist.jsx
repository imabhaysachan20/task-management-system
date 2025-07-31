import API from "@/lib/axios";
import { Button } from "./ui/button";

export default function TaskList({ tasks, onTaskDeleted }) {
  const handleDelete = async (id) => {
    try {
      await API.delete(`/tasks/${id}`);
      onTaskDeleted();
    } catch {
      alert("Failed to delete task");
    }
  };

  if (!tasks.length) return <p>No tasks found.</p>;

  return (
    <ul className="space-y-2">
      {tasks.map((task) => (
        <li key={task._id} className="flex justify-between items-center border p-2 rounded">
          <span>{task.title}</span>
          <Button variant="destructive" onClick={() => handleDelete(task._id)}>
            Delete
          </Button>
        </li>
      ))}
    </ul>
  );
}
