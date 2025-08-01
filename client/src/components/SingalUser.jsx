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
  Trash2,
  Edit,
  Calendar,
  Clock
} from 'lucide-react'

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

  // Modal states
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [modalMode, setModalMode] = useState('create')
  const [selectedTask, setSelectedTask] = useState(null)
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    dueDate: '',
    status: 'pending'
  })

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

  // Task CRUD operations
  const handleCreateTask = async (e) => {
    e.preventDefault()
    try {
      await API.post('/tasks', {
        ...formData,
        assignedTo: id
      })
      fetchTasks()
      setIsModalOpen(false)
      resetForm()
    } catch (err) {
      setError('Failed to create task')
    }
  }

  const handleUpdateTask = async (e) => {
    e.preventDefault()
    try {
      await API.put(`/tasks/${selectedTask._id}`, formData)
      fetchTasks()
      setIsModalOpen(false)
      resetForm()
    } catch (err) {
      setError('Failed to update task')
    }
  }

  const handleDeleteTask = async (taskId) => {
    if (!window.confirm('Are you sure you want to delete this task?')) return
    try {
      await API.delete(`/tasks/${taskId}`)
      fetchTasks()
    } catch (err) {
      setError('Failed to delete task')
    }
  }

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      dueDate: '',
      status: 'pending'
    })
    setSelectedTask(null)
  }

  const openCreateModal = () => {
    setModalMode('create')
    resetForm()
    setIsModalOpen(true)
  }

  const openEditModal = (task) => {
    setModalMode('edit')
    setSelectedTask(task)
    setFormData({
      title: task.title,
      description: task.description,
      dueDate: task.dueDate?.split('T')[0] || '',
      status: task.status
    })
    setIsModalOpen(true)
  }

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
          <Button onClick={openCreateModal}>
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
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="in-progress">In Progress</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
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
        
        <div className="divide-y divide-gray-200">
          {loading ? (
            <div className="p-6 text-center">Loading tasks...</div>
          ) : tasks?.length === 0 ? (
            <div className="p-6 text-center text-gray-500">No tasks assigned</div>
          ) : (
            tasks.map((task) => (
              <div key={task._id} className="p-6">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-lg font-semibold mb-2">{task.title}</h3>
                    <p className="text-gray-600 mb-2">{task.description}</p>
                    <div className="flex items-center gap-4 text-sm text-gray-500">
                      <div className="flex items-center">
                        <Calendar className="w-4 h-4 mr-1" />
                        {new Date(task.dueDate).toLocaleDateString()}
                      </div>
                      <div className="flex items-center">
                        <Clock className="w-4 h-4 mr-1" />
                        Status: {task.status}
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="ghost"
                      onClick={() => openEditModal(task)}
                      className="text-indigo-600 hover:text-indigo-900"
                    >
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      onClick={() => handleDeleteTask(task._id)}
                      className="text-red-600 hover:text-red-900"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </div>
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

      {/* Create/Edit Task Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h2 className="text-xl font-bold mb-4">
              {modalMode === 'create' ? 'Assign New Task' : 'Edit Task'}
            </h2>
            <form onSubmit={modalMode === 'create' ? handleCreateTask : handleUpdateTask}>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Title
                  </label>
                  <Input
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Description
                  </label>
                  <Textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Due Date
                  </label>
                  <Input
                    type="date"
                    value={formData.dueDate}
                    onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Status
                  </label>
                  <Select 
                    value={formData.status} 
                    onValueChange={(value) => setFormData({ ...formData, status: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="pending">Pending</SelectItem>
                      <SelectItem value="in-progress">In Progress</SelectItem>
                      <SelectItem value="completed">Completed</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="mt-6 flex justify-end space-x-3">
                <Button type="button" variant="outline" onClick={() => setIsModalOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit">
                  {modalMode === 'create' ? 'Create Task' : 'Update Task'}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

export default SingleUser