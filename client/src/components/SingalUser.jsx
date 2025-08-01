import React, { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import API from '@/lib/axios'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import {
  Plus,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react'
import TaskForm from './TaskForm'
import TaskCard from './TaskCard'

function SingleUser() {
  const { id } = useParams()
  const [user, setUser] = useState(null)
  const [tasks, setTasks] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [totalTasks, setTotalTasks] = useState(0)
  const itemsPerPage = 5

  // Filter and sort states
  const [selectedStatus, setSelectedStatus] = useState('all')
  const [sortBy, setSortBy] = useState('createdAt')
  const [sortOrder, setSortOrder] = useState('desc')

  const [showTaskForm, setShowTaskForm] = useState(false)
  const [selectedTask, setSelectedTask] = useState(null)

  // Fetch user details
  const fetchUser = async () => {
    try {
      const response = await API.get(`/users/${id}`)
      setUser(response.data)
    } catch (err) {
      setError('Failed to fetch user details')
    }
  }

  // Fetch user's tasks
  const fetchTasks = async () => {
    try {
      setLoading(true)
      const response = await API.get(`/tasks/user/${id}`, {
        params: {
          page: currentPage,
          limit: itemsPerPage,
          status: selectedStatus === 'all' ? undefined : selectedStatus,
          sortBy,
          order: sortOrder
        }
      })
      const { tasks: fetchedTasks, totalPages, totalTasks: total } = response.data
      setTasks(fetchedTasks)
      setTotalPages(totalPages)
      setTotalTasks(total)
    } catch (err) {
      setError('Failed to fetch tasks')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchUser()
    fetchTasks()
  }, [id, currentPage, selectedStatus, sortBy, sortOrder])

  const handleTaskCreated = () => {
    setShowTaskForm(false);
    fetchTasks();
  };

  const handleTaskUpdated = () => {
    setSelectedTask(null);
    fetchTasks();
  };

  const handleTaskDeleted = () => {
    fetchTasks();
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'todo':
        return 'bg-gray-100 text-gray-800';
      case 'in-progress':
        return 'bg-blue-100 text-blue-800';
      case 'done':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'low':
        return 'bg-gray-100 text-gray-800';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800';
      case 'high':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriorityIcon = (priority) => {
    return null; // You can implement priority icons if needed
  };

  if (!user && !loading) {
    return <div className="p-6">User not found</div>
  }

  return (
    <div className="p-6">
      {/* User Info Header */}
      <div className="bg-white rounded-lg shadow p-6 mb-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold mb-2">User Profile</h1>
            <p className="text-gray-600">{user?.email}</p>
            <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
              user?.role === 'admin' ? 'bg-purple-100 text-purple-800' : 'bg-green-100 text-green-800'
            }`}>
              {user?.role}
            </span>
          </div>
          <Button onClick={() => setShowTaskForm(true)}>
            <Plus className="w-4 h-4 mr-2" />
            Assign New Task
          </Button>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      {/* Tasks List */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold">Assigned Tasks ({totalTasks})</h2>
            <div className="flex gap-4">
              <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="todo">To Do</SelectItem>
                  <SelectItem value="in-progress">In Progress</SelectItem>
                  <SelectItem value="done">Done</SelectItem>
                </SelectContent>
              </Select>
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="createdAt">Created Date</SelectItem>
                  <SelectItem value="dueDate">Due Date</SelectItem>
                  <SelectItem value="status">Status</SelectItem>
                </SelectContent>
              </Select>
              <Button
                variant="outline"
                onClick={() => setSortOrder(prev => prev === 'asc' ? 'desc' : 'asc')}
              >
                {sortOrder.toUpperCase()}
              </Button>
            </div>
          </div>
        </div>
        
        <div className="grid gap-4 p-4">
          {loading ? (
            <div className="p-6 text-center">Loading tasks...</div>
          ) : tasks?.length === 0 ? (
            <div className="p-6 text-center text-gray-500">No tasks assigned</div>
          ) : (
            tasks.map((task) => (
              <TaskCard
                key={task._id}
                task={task}
                canEdit={true}
                onTaskDeleted={handleTaskDeleted}
                onTaskUpdated={handleTaskUpdated}
                getStatusColor={getStatusColor}
                getPriorityColor={getPriorityColor}
                getPriorityIcon={getPriorityIcon}
              />
            ))
          )}
        </div>
      </div>

      {/* Pagination */}
      {!loading && tasks.length > 0 && (
        <div className="flex items-center justify-between px-4 py-3 bg-white border-t border-gray-200 sm:px-6 mt-4 rounded-lg">
          <div className="flex justify-between w-full">
            <Button
              variant="outline"
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
            >
              <ChevronLeft className="w-4 h-4 mr-2" />
              Previous
            </Button>
            <span className="text-sm text-gray-700">
              Page {currentPage} of {totalPages}
            </span>
            <Button
              variant="outline"
              onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
            >
              Next
              <ChevronRight className="w-4 h-4 ml-2" />
            </Button>
          </div>
        </div>
      )}

      {/* Create Task Modal */}
      {showTaskForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold">Create New Task</h3>
                <Button 
                  variant="ghost" 
                  onClick={() => setShowTaskForm(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  ×
                </Button>
              </div>
              <TaskForm
                onTaskCreated={handleTaskCreated}
                defaultAssignedTo={id}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default SingleUser