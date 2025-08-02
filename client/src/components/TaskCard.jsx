import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { 
  Calendar, 
  User, 
  FileText, 
  Trash2, 
  Edit, 
  Download,
  MoreVertical,
  Eye
} from 'lucide-react';

import API from '@/lib/axios';
import TaskEditForm from './TaskEditForm';
import axios from 'axios';
import { toast } from 'sonner';
const apiUrl = import.meta.env.VITE_API_URL;
const StaticAPI = axios.create({
  baseURL: apiUrl, 
});

function TaskCard({ 
  task, 
  canEdit, 
  onTaskDeleted, 
  onTaskUpdated, 
  getStatusColor, 
  getPriorityColor, 
  getPriorityIcon 
}) {
  const [showEditForm, setShowEditForm] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete this task?')) return;
    
    setIsDeleting(true);
    try {
      await API.delete(`/tasks/${task._id}`);
      onTaskDeleted();
    } catch (err) {
      toast.error('Failed to delete task');
    } finally {
      setIsDeleting(false);
    }
  };

  const handleDownloadDocument = async (documentPath) => {
    try {
      let apiUrl = import.meta.env.VITE_API_URL
      apiUrl = apiUrl.substring(0, apiUrl.length - 1);
      apiUrl = `${apiUrl}${documentPath}`
      console.log(apiUrl)
      const response = await axios.get(apiUrl, { responseType: 'blob' });

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', documentPath.split('/').pop());
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      toast.error('Failed to download document');
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'No due date';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };
  console.log(task)
  return (
    <>
      <div className="bg-white border rounded-lg p-3 sm:p-4 hover:shadow-md transition-shadow">
        {/* Header */}
        <div className="flex justify-between items-start mb-3">
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-gray-900 mb-1 line-clamp-2 text-sm sm:text-base">{task.title}</h3>
            <div className="flex flex-wrap items-center gap-1 sm:gap-2">
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(task.status)}`}>
                {task.status.replace('-', ' ').toUpperCase()}
              </span>
              <span className={`px-2 py-1 rounded-full text-xs font-medium flex items-center gap-1 ${getPriorityColor(task.priority)}`}>
                {getPriorityIcon(task.priority)}
                <span className="hidden sm:inline">{task.priority.toUpperCase()}</span>
                <span className="sm:hidden">{task.priority.charAt(0).toUpperCase()}</span>
              </span>
            </div>
          </div>
          
          {canEdit && (
            <div className="relative ml-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowMenu(!showMenu)}
                className="p-1 h-8 w-8"
              >
                <MoreVertical className="w-4 h-4" />
              </Button>
              
              {showMenu && (
                <div className="absolute right-0 top-8 bg-white border rounded-md shadow-lg z-10 min-w-[120px]">
                  <button
                    onClick={() => {
                      setShowEditForm(true);
                      setShowMenu(false);
                    }}
                    className="flex items-center gap-2 w-full px-3 py-2 text-sm text-gray-700 hover:bg-gray-50"
                  >
                    <Edit className="w-4 h-4" />
                    Edit
                  </button>
                  <button
                    onClick={() => {
                      handleDelete();
                      setShowMenu(false);
                    }}
                    disabled={isDeleting}
                    className="flex items-center gap-2 w-full px-3 py-2 text-sm text-red-600 hover:bg-red-50 disabled:opacity-50"
                  >
                    <Trash2 className="w-4 h-4" />
                    {isDeleting ? 'Deleting...' : 'Delete'}
                  </button>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Description */}
        {task.description && (
          <p className="text-gray-600 text-sm mb-3 line-clamp-2">{task.description}</p>
        )}

        {/* Due Date */}
        {task.dueDate && (
          <div className="flex items-center gap-2 text-sm text-gray-500 mb-3">
            <Calendar className="w-4 h-4 flex-shrink-0" />
            <span className="truncate">Due: {formatDate(task.dueDate)}</span>
          </div>
        )}

        {/* Assignment Info */}
        <div className="space-y-2 mb-3">
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <User className="w-4 h-4 flex-shrink-0" />
            <span className="truncate">Created by: {task.createdBy.email}</span>
          </div>
          {task.assignedTo._id !== task.createdBy._id && (
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <User className="w-4 h-4 flex-shrink-0" />
              <span className="truncate">Assigned to: {task.assignedTo.email}</span>
            </div>
          )}
        </div>

        {/* Documents */}
        {task.documents && task.documents.length > 0 && (
          <div className="border-t pt-3">
            <div className="flex items-center gap-2 text-sm text-gray-700 mb-2">
              <FileText className="w-4 h-4 flex-shrink-0" />
              <span>Documents ({task.documents.length})</span>
            </div>
            <div className="space-y-1">
              {task.documents.map((doc, index) => (
                
                <button
                  key={index}
                  onClick={() => handleDownloadDocument(doc)}
                  className="flex items-center gap-2 text-sm text-blue-600 hover:text-blue-800 hover:underline w-full text-left"
                >
                  <Download className="w-3 h-3 flex-shrink-0" />
                  <span className="truncate">{doc.split('/').pop()}</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="text-xs text-gray-400 mt-3 pt-3 border-t">
          Created: {formatDate(task.createdAt)}
        </div>
      </div>

      {/* Edit Form Modal */}
      {showEditForm && (
        <div onClick={(e)=>{if (e.target==e.currentTarget) {setShowEditForm(false)}}} className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-2 sm:p-4">
          <div className="bg-white rounded-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="p-4 sm:p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold">Edit Task</h3>
                <Button 
                  variant="ghost" 
                  onClick={() => setShowEditForm(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  ×
                </Button>
              </div>
              <TaskEditForm 
                task={task}
                onTaskUpdated={() => {
                  setShowEditForm(false);
                  onTaskUpdated();
                }}
                onCancel={() => setShowEditForm(false)}
              />
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default TaskCard;