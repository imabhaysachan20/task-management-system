import React, { useEffect, useState } from 'react'
import TaskForm from './taskform'
import TaskList from './tasklist'
import API from '@/lib/axios';

function UserDashboard() {
  const [tasks, setTasks] = useState([]);
   const fetchTasks = async () => {
      try {
        const res = await API.get("/tasks");
        console.log(res)
        setTasks(res.data.tasks);
      } catch (err) {
        alert("Failed to fetch tasks");
      }
    };
  
     useEffect(() => {
    fetchTasks();
  }, []);
  return (
    <div className="space-y-8">
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Create New Task</h2>
            <TaskForm onTaskCreated={fetchTasks} />
          </div>
          
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Your Tasks</h2>
            <TaskList tasks={tasks} onTaskDeleted={fetchTasks} />
          </div>
        </div>
  )
}

export default UserDashboard