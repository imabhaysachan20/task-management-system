import { useState, useEffect } from "react";
import API from "@/lib/axios";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Textarea } from "./ui/textarea";
import { Upload, X, FileText } from "lucide-react";
import { toast } from "sonner";

export default function TaskEditForm({ task, onTaskUpdated, onCancel }) {
  const [formData, setFormData] = useState({
    title: task.title || "",
    description: task.description || "",
    status: task.status || "todo",
    priority: task.priority || "medium",
    dueDate: task.dueDate ? new Date(task.dueDate).toISOString().split('T')[0] : "",
    assignedTo: task.assignedTo._id || ""
  });
  const [documents, setDocuments] = useState([]);
  const [users, setUsers] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [dragActive, setDragActive] = useState(false);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const res = await API.get("/users/all");
      setUsers(res.data || []);
    } catch (err) {
      console.error("Failed to fetch users:", err);
    }
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    addFiles(files);
  };

  const addFiles = (files) => {
    const validFiles = files.filter(file => {
      if (file.type !== 'application/pdf') {
        toast.error(`${file.name} is not a PDF file`);
        return false;
      }
      if (file.size > 5 * 1024 * 1024) {
        toast.error(`${file.name} is larger than 5MB`);
        return false;
      }
      return true;
    });

    const currentDocCount = (task.documents?.length || 0) + documents.length;
    const availableSlots = 3 - currentDocCount;
    
    if (validFiles.length > availableSlots) {
      toast.error(`Can only add ${availableSlots} more documents (max 3 total)`);
      setDocuments(prev => [...prev, ...validFiles.slice(0, availableSlots)]);
    } else {
      setDocuments(prev => [...prev, ...validFiles]);
    }
  };

  const removeFile = (index) => {
    setDocuments(prev => prev.filter((_, i) => i !== index));
  };

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const files = Array.from(e.dataTransfer.files);
      addFiles(files);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const submitData = new FormData();
      
      // Append form fields
      Object.keys(formData).forEach(key => {
        if (formData[key]) {
          submitData.append(key, formData[key]);
        }
      });

      // Append new documents
      documents.forEach(file => {
        submitData.append('documents', file);
      });

      await API.patch(`/tasks/${task._id}`, submitData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      onTaskUpdated();
    } catch (err) {
      toast.error(err.response?.data?.error || "Failed to update task");
    } finally {
      setIsSubmitting(false);
    }
  };

  const currentDocCount = (task.documents?.length || 0) + documents.length;
  const canAddMore = currentDocCount < 3;

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Title */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Task Title *
        </label>
        <Input
          placeholder="Enter task title"
          value={formData.title}
          onChange={(e) => handleInputChange('title', e.target.value)}
          required
        />
      </div>

      {/* Description */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Description
        </label>
        <Textarea
          placeholder="Enter task description"
          value={formData.description}
          onChange={(e) => handleInputChange('description', e.target.value)}
          rows={3}
        />
      </div>

      {/* Status and Priority */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Status
          </label>
          <Select value={formData.status} onValueChange={(value) => handleInputChange('status', value)}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="todo">To Do</SelectItem>
              <SelectItem value="in-progress">In Progress</SelectItem>
              <SelectItem value="done">Done</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Priority
          </label>
          <Select value={formData.priority} onValueChange={(value) => handleInputChange('priority', value)}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="low">Low</SelectItem>
              <SelectItem value="medium">Medium</SelectItem>
              <SelectItem value="high">High</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Due Date and Assigned To */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Due Date
          </label>
          <Input
            type="date"
            value={formData.dueDate}
            onChange={(e) => handleInputChange('dueDate', e.target.value)}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Assign To
          </label>
          <Select value={formData.assignedTo} onValueChange={(value) => handleInputChange('assignedTo', value)}>
            <SelectTrigger>
              <SelectValue placeholder="Select user" />
            </SelectTrigger>
            <SelectContent>
              {users.map(user => (
                <SelectItem key={user._id} value={user._id}>
                  {user.email}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Existing Documents */}
      {task.documents && task.documents.length > 0 && (
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Current Documents
          </label>
          <div className="space-y-2">
            {task.documents.map((doc, index) => (
              <div key={index} className="flex items-center gap-2 bg-gray-50 p-3 rounded-lg">
                <FileText className="w-4 h-4 text-red-600" />
                <span className="text-sm text-gray-700">{doc.split('/').pop()}</span>
                <span className="text-xs text-gray-500">(existing)</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Add New Documents */}
      {canAddMore && (
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Add New Documents (PDF only, max {3 - (task.documents?.length || 0)} more files)
          </label>
          
          {/* Drop Zone */}
          <div
            className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors ${
              dragActive 
                ? 'border-blue-500 bg-blue-50' 
                : 'border-gray-300 hover:border-gray-400'
            }`}
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
          >
            <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
            <p className="text-gray-600 mb-2">
              Drag and drop PDF files here, or{" "}
              <label className="text-blue-600 hover:text-blue-700 cursor-pointer underline">
                browse
                <input
                  type="file"
                  multiple
                  accept=".pdf"
                  onChange={handleFileChange}
                  className="hidden"
                  disabled={!canAddMore}
                />
              </label>
            </p>
            <p className="text-sm text-gray-500">
              {currentDocCount}/3 total documents
            </p>
          </div>

          {/* New File List */}
          {documents.length > 0 && (
            <div className="mt-4 space-y-2">
              {documents.map((file, index) => (
                <div key={index} className="flex items-center justify-between bg-blue-50 p-3 rounded-lg">
                  <div className="flex items-center gap-2">
                    <FileText className="w-4 h-4 text-red-600" />
                    <span className="text-sm text-gray-700">{file.name}</span>
                    <span className="text-xs text-gray-500">
                      ({(file.size / 1024 / 1024).toFixed(2)} MB) - new
                    </span>
                  </div>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => removeFile(index)}
                    className="text-red-600 hover:text-red-700 p-1"
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Submit Buttons */}
      <div className="flex justify-end gap-3">
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
          disabled={isSubmitting}
        >
          Cancel
        </Button>
        <Button
          type="submit"
          disabled={isSubmitting || !formData.title.trim()}
          className="min-w-[120px]"
        >
          {isSubmitting ? (
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              Updating...
            </div>
          ) : (
            "Update Task"
          )}
        </Button>
      </div>
    </form>
  );
}