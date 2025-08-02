import React, { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import API from '@/lib/axios';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  Plus, 
  Search, 
  Filter, 
  ChevronLeft, 
  ChevronRight, 
  Calendar,
  User,
  FileText,
  Trash2,
  Edit,
  Download,
  Clock,
  AlertCircle,
  CheckCircle2
} from 'lucide-react';
import TaskForm from './TaskForm';
import TaskCard from './TaskCard';
import ManageUser from './ManageUser';

function AdminDashboard() {
  const { user } = useAuth();
  const [alltasks, setallTasks] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showTaskForm, setShowTaskForm] = useState(false);
  const [activeTab, setActiveTab] = useState('my-tasks'); // 'my-tasks' or 'assigned-tasks'
  
  // Pagination and filtering state
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalTasks, setTotalTasks] = useState(0);
  const [limit] = useState(6);
  
  // Filter and sort state
  const [filters, setFilters] = useState({
    status: 'all',
    priority: 'all',
    sortBy: 'createdAt',
    order: 'desc',
    search: ''
  });

  const fetchTasks = async (page = 1, filterOverrides = {}) => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString(),
        sortBy: filters.sortBy,
        order: filters.order,
        ...filterOverrides
      });

      if (filters.status && filters.status !== 'all') params.append('status', filters.status);
      if (filters.priority && filters.priority !== 'all') params.append('priority', filters.priority);

      const res = await API.get(`/tasks?${params}`);
      const data = res.data;
      console.log(data)
      setTasks(data.tasks || []);
      setallTasks(data.tasks || []);
      setTotalTasks(data.total || 0);
      setTotalPages(Math.ceil((data.total || 0) / limit));
      setCurrentPage(page);
    } catch (err) {
      console.error('Failed to fetch tasks:', err);
      setTasks([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks(1);
  }, [filters.status, filters.priority, filters.sortBy, filters.order]);

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
    setCurrentPage(1);
  };

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      fetchTasks(page);
    }
  };

  const handleTaskCreated = () => {
    setShowTaskForm(false);
    fetchTasks(1);
  };

  const handleTaskDeleted = () => {
    fetchTasks(currentPage);
  };

  // Filter tasks based on active tab
  const getFilteredTasks = () => {
    if (!tasks.length) return [];
    
    return tasks.filter(task => {
      const isCreatedByUser = task?.createdBy?._id === user?.id;
      
      
      if (activeTab === 'my-tasks') {
        return isCreatedByUser;
      } else {
        return tasks;
      }
    });
  };

  const filteredTasks = getFilteredTasks();

  const getStatusColor = (status) => {
    switch (status) {
      case 'todo': return 'bg-gray-100 text-gray-800';
      case 'in-progress': return 'bg-blue-100 text-blue-800';
      case 'done': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'low': return 'bg-green-100 text-green-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'high': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriorityIcon = (priority) => {
    switch (priority) {
      case 'low': return <CheckCircle2 className="w-4 h-4" />;
      case 'medium': return <Clock className="w-4 h-4" />;
      case 'high': return <AlertCircle className="w-4 h-4" />;
      default: return <Clock className="w-4 h-4" />;
    }
  };

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Header with Create Task Button */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className='hidden sm:block'>
          <h2 className="text-xl sm:text-2xl font-bold text-gray-900">Task Management</h2>
          <p className="text-sm sm:text-base text-gray-600 mt-1">Manage your tasks and assignments</p>
        </div>
        <Button 
          onClick={() => setShowTaskForm(true)}
          className="flex items-center gap-2 w-full sm:w-auto"
        >
          <Plus className="w-4 h-4" />
          Create Task
        </Button>
      </div>

      {/* Task Form Modal */}
      {showTaskForm && (
        <div onClick={(e)=>{if (e.target == e.currentTarget) {setShowTaskForm(false)}}} className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-2 sm:p-4">
          <div className="bg-white rounded-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="p-4 sm:p-6">
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
              <TaskForm onTaskCreated={handleTaskCreated} />
            </div>
          </div>
        </div>
      )}

      {/* Tabs */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex overflow-x-auto space-x-4 sm:space-x-8">
          <button
            onClick={() => setActiveTab('my-tasks')}
            className={`py-2 px-1 border-b-2 font-medium text-sm whitespace-nowrap ${
              activeTab === 'my-tasks'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            My Tasks ({tasks.filter(t => t.createdBy._id === user?.id).length})
          </button>
          <button
            onClick={() => setActiveTab('assigned-tasks')}
            className={`py-2 px-1 border-b-2 font-medium text-sm whitespace-nowrap ${
              activeTab === 'assigned-tasks'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            All Tasks ({tasks.length})
          </button>
          <button
            onClick={() => setActiveTab('users')}
            className={`py-2 px-1 border-b-2 font-medium text-sm whitespace-nowrap ${
              activeTab === 'users'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Users
          </button>
        </nav>
      </div>

      {/* Filters and Search */}
      {activeTab !="users" && <><div className="bg-white rounded-lg shadow-sm border p-3 sm:p-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Search</label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input
                placeholder="Search tasks..."
                onChange={(e)=>{
                  const value = e.target.value.toLowerCase();
                  setTasks(alltasks.filter(t => t.title.toLowerCase().includes(value)));
                }}
                className="pl-10"
              />
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
            <Select value={filters.status} onValueChange={(value) => handleFilterChange('status', value)}>
              <SelectTrigger>
                <SelectValue placeholder="All Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="todo">To Do</SelectItem>
                <SelectItem value="in-progress">In Progress</SelectItem>
                <SelectItem value="done">Done</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Priority</label>
            <Select value={filters.priority} onValueChange={(value) => handleFilterChange('priority', value)}>
              <SelectTrigger>
                <SelectValue placeholder="All Priority" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Priority</SelectItem>
                <SelectItem value="low">Low</SelectItem>
                <SelectItem value="medium">Medium</SelectItem>
                <SelectItem value="high">High</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Sort By</label>
            <Select value={`${filters.sortBy}-${filters.order}`} onValueChange={(value) => {
              const [sortBy, order] = value.split('-');
              handleFilterChange('sortBy', sortBy);
              handleFilterChange('order', order);
            }}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="createdAt-desc">Newest First</SelectItem>
                <SelectItem value="createdAt-asc">Oldest First</SelectItem>
                <SelectItem value="dueDate-asc">Due Date (Earliest)</SelectItem>
                <SelectItem value="dueDate-desc">Due Date (Latest)</SelectItem>
                <SelectItem value="priority-desc">Priority (High to Low)</SelectItem>
                <SelectItem value="priority-asc">Priority (Low to High)</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      {/* Tasks Grid */}
      <div className="bg-white rounded-lg shadow-sm border">
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : filteredTasks.length === 0 ? (
          <div className="text-center py-12 px-4">
            <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              {activeTab === 'my-tasks' ? 'No tasks created yet' : 'No tasks assigned to you'}
            </h3>
            <p className="text-gray-500">
              {activeTab === 'my-tasks' 
                ? 'Create your first task to get started' 
                : 'Tasks assigned to you will appear here'
              }
            </p>
          </div>
        ) : (
          <div className="p-3 sm:p-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6">
              {filteredTasks.map((task) => (
                <TaskCard 
                  key={task._id} 
                  task={task} 
                  canEdit={true}
                  onTaskDeleted={handleTaskDeleted}
                  onTaskUpdated={() => fetchTasks(currentPage)}
                  getStatusColor={getStatusColor}
                  getPriorityColor={getPriorityColor}
                  getPriorityIcon={getPriorityIcon}
                />
              ))}
            </div>
          </div>
        )}
      </div>
        
      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex flex-col sm:flex-row items-center justify-between bg-white rounded-lg shadow-sm border p-3 sm:p-4 gap-4">
          <div className="text-sm text-gray-700 text-center sm:text-left">
            Showing {((currentPage - 1) * limit) + 1} to {Math.min(currentPage * limit, totalTasks)} of {totalTasks} tasks
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
            >
              <ChevronLeft className="w-4 h-4" />
              <span className="hidden sm:inline">Previous</span>
            </Button>
            
            <div className="flex items-center gap-1">
              {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                let pageNum;
                if (totalPages <= 5) {
                  pageNum = i + 1;
                } else if (currentPage <= 3) {
                  pageNum = i + 1;
                } else if (currentPage >= totalPages - 2) {
                  pageNum = totalPages - 4 + i;
                } else {
                  pageNum = currentPage - 2 + i;
                }
                
                return (
                  <Button
                    key={pageNum}
                    variant={currentPage === pageNum ? "default" : "outline"}
                    size="sm"
                    onClick={() => handlePageChange(pageNum)}
                    className="w-8 h-8 p-0"
                  >
                    {pageNum}
                  </Button>
                );
              })}
            </div>
            
            <Button
              variant="outline"
              size="sm"
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
            >
              <span className="hidden sm:inline">Next</span>
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
        </div>
      )}</>}

      {activeTab=="users" && <ManageUser/>}
    </div>
  );
}

export default AdminDashboard;