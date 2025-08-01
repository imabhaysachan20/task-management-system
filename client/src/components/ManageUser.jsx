import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import API from '@/lib/axios'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { 
  Plus, 
  ChevronLeft, 
  ChevronRight,
  Trash2,
  Edit,
} from 'lucide-react'

function ManageUser() {
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  
  // Pagination states
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const itemsPerPage = 5
  
  // Modal states
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [modalMode, setModalMode] = useState('create') // 'create' or 'edit'
  const [selectedUser, setSelectedUser] = useState(null)
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    role: 'user'
  })

  // Fetch users with pagination
  const fetchUsers = async () => {
    try {
      setLoading(true)
      setError(null)
      
      const response = await API.get('/users', {
        params: {
          page: currentPage,
          limit: itemsPerPage
        }
      })
      
      const { users: fetchedUsers, totalPages: total } = response.data
      setUsers(fetchedUsers)
      setTotalPages(total)
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to fetch users')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchUsers()
  }, [currentPage])

  // CRUD Operations
  const handleCreateUser = async () => {
    try {
      await API.post('/users', formData)
      fetchUsers()
      setIsModalOpen(false)
      resetForm()
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to create user')
    }
  }

  const handleUpdateUser = async () => {
    try {
      await API.put(`/users/${selectedUser._id}`, {
        role: formData.role
      })
      fetchUsers()
      setIsModalOpen(false)
      resetForm()
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to update user')
    }
  }

  const handleDeleteUser = async (userId) => {
    if (!window.confirm('Are you sure you want to delete this user?')) return
    
    try {
      await API.delete(`/users/${userId}`)
      fetchUsers()
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to delete user')
    }
  }

  const resetForm = () => {
    setFormData({
      email: '',
      password: '',
      role: 'user'
    })
    setSelectedUser(null)
  }

  const openCreateModal = () => {
    setModalMode('create')
    resetForm()
    setIsModalOpen(true)
  }

  const openEditModal = (user) => {
    setModalMode('edit')
    setSelectedUser(user)
    setFormData({
      ...formData,
      email: user.email,
      role: user.role
    })
    setIsModalOpen(true)
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Users</h2>
        <Button onClick={openCreateModal}>
          <Plus className="w-4 h-4 mr-2" />
          Add User
        </Button>
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      {/* Users Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="min-w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Email
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Role
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Created At
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {loading ? (
              <tr>
                <td colSpan="4" className="px-6 py-4 text-center">
                  Loading...
                </td>
              </tr>
            ) : users.length === 0 ? (
              <tr>
                <td colSpan="4" className="px-6 py-4 text-center">
                  No users found
                </td>
              </tr>
            ) : (
              users.map((user) => (
                <tr key={user._id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <Link 
                      to={`/dashboard/${user._id}`} 
                      className="text-indigo-600 hover:text-indigo-900 hover:underline"
                    >
                      {user.email}
                    </Link>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      user.role === 'admin' ? 'bg-purple-100 text-purple-800' : 'bg-green-100 text-green-800'
                    }`}>
                      {user.role}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {new Date(user.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <Button
                      variant="ghost"
                      onClick={() => openEditModal(user)}
                      className="text-indigo-600 hover:text-indigo-900 mr-2"
                    >
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      onClick={() => handleDeleteUser(user._id)}
                      className="text-red-600 hover:text-red-900"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
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

      {/* Create/Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h2 className="text-xl font-bold mb-4">
              {modalMode === 'create' ? 'Create User' : 'Edit User'}
            </h2>
            <form onSubmit={(e) => {
              e.preventDefault()
              modalMode === 'create' ? handleCreateUser() : handleUpdateUser()
            }}>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Email
                  </label>
                  <Input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    disabled={modalMode === 'edit'}
                    required
                  />
                </div>
                {modalMode === 'create' && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Password
                    </label>
                    <Input
                      type="password"
                      value={formData.password}
                      onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                      required
                    />
                  </div>
                )}
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Role
                  </label>
                  <Select value={formData.role} onValueChange={(value) => setFormData({ ...formData, role: value })}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select role" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="user">User</SelectItem>
                      <SelectItem value="admin">Admin</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="mt-6 flex justify-end space-x-3">
                <Button type="button" variant="outline" onClick={() => setIsModalOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit">
                  {modalMode === 'create' ? 'Create' : 'Update'}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

export default ManageUser