import React, { useState, useEffect } from 'react';
import { X, Calendar, CheckSquare, Tag as TagIcon, Clock, Edit2, Trash2, Plus } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { subtaskService } from '../../services/subtask.service';

const TaskDetailsModal = ({ task, isOpen, onClose, onEdit, onDelete, onRefresh }) => {
  const [subtasks, setSubtasks] = useState([]);
  const [newSubtaskTitle, setNewSubtaskTitle] = useState('');
  const tags = task?.tags || [];
  
  useEffect(() => {
    const fetchSubtasks = async () => {
      try {
        const data = await subtaskService.getSubtasks(task.id);
        setSubtasks(data || []);
      } catch (error) {
        console.error('Failed to fetch subtasks:', error);
      }
    };

    if (isOpen && task?.id) {
      fetchSubtasks();
    }
  }, [task?.id, isOpen]);

  if (!isOpen) return null;

  const handleAddSubtask = async (e) => {
    e.preventDefault();
    if (!newSubtaskTitle.trim()) return;
    try {
      const added = await subtaskService.createSubtask(task.id, { title: newSubtaskTitle, isDone: false });
      setSubtasks([...subtasks, added]);
      setNewSubtaskTitle('');
      if (onRefresh) onRefresh();
    } catch (error) {
      console.error(error);
    }
  };

  const toggleSubtask = async (subtaskId, isDone) => {
    const subtask = subtasks.find(s => s.id === subtaskId);
    try {
      const updated = await subtaskService.updateSubtask(subtaskId, { 
        title: subtask.title, 
        isDone: !isDone 
      });
      setSubtasks(subtasks.map(s => s.id === subtaskId ? { ...s, isDone: updated.isDone } : s));
      if (onRefresh) onRefresh();
    } catch (error) {
      console.error(error);
    }
  };

  const handleDeleteSubtask = async (subtaskId) => {
    try {
      await subtaskService.deleteSubtask(subtaskId);
      setSubtasks(subtasks.filter(s => s.id !== subtaskId));
      if (onRefresh) onRefresh();
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-secondary-900/40 backdrop-blur-sm">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="bg-white rounded-2xl w-full max-w-2xl shadow-2xl flex flex-col max-h-[90vh]"
        >
          <div className="flex justify-between items-start p-6 border-b border-secondary-100">
            <div className="pr-8">
              <h2 className="text-2xl font-bold text-secondary-900 mb-2">{task.title}</h2>
              <div className="flex items-center gap-4 text-sm">
                <span className={`px-2.5 py-1 rounded-md font-medium ${
                  task.status === 'DONE' ? 'bg-emerald-100 text-emerald-700' :
                  task.status === 'IN_PROGRESS' ? 'bg-amber-100 text-amber-700' :
                  'bg-blue-100 text-blue-700'
                }`}>
                  {task.status === 'DONE' ? 'HOÀN THÀNH' :
                   task.status === 'IN_PROGRESS' ? 'ĐANG THỰC HIỆN' :
                   'CẦN LÀM'}
                </span>
                {task.dueDate && (
                  <span className="flex items-center gap-1.5 text-secondary-500 font-medium">
                    <Calendar size={16} />
                    {new Date(task.dueDate).toLocaleDateString()}
                  </span>
                )}
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <button onClick={onEdit} className="p-2 text-secondary-400 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-colors">
                <Edit2 size={18} />
              </button>
              <button onClick={onDelete} className="p-2 text-secondary-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors">
                <Trash2 size={18} />
              </button>
              <div className="w-px h-6 bg-secondary-200 mx-1"></div>
              <button
                onClick={onClose}
                className="text-secondary-400 hover:text-secondary-600 transition-colors p-2 rounded-lg hover:bg-secondary-50"
              >
                <X size={20} />
              </button>
            </div>
          </div>

          <div className="p-6 overflow-y-auto flex-1">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="md:col-span-2 space-y-8">
                {/* Description */}
                <div>
                  <h3 className="text-sm font-semibold text-secondary-900 uppercase tracking-wider mb-3">Mô tả</h3>
                  <div className="bg-secondary-50 rounded-xl p-4 text-secondary-700 whitespace-pre-wrap min-h-[100px]">
                    {task.description || 'Chưa có mô tả.'}
                  </div>
                </div>

                {/* Subtasks */}
                <div>
                  <h3 className="text-sm font-semibold text-secondary-900 uppercase tracking-wider mb-3 flex items-center justify-between">
                    <span>Công việc phụ</span>
                    <span className="bg-secondary-100 text-secondary-600 px-2 py-0.5 rounded-full text-xs font-medium">
                      {subtasks.filter(s => s.isDone).length} / {subtasks.length}
                    </span>
                  </h3>
                  
                  {/* Progress bar */}
                  {subtasks.length > 0 && (
                    <div className="w-full bg-secondary-100 rounded-full h-1.5 mb-4">
                      <div 
                        className="bg-primary-500 h-1.5 rounded-full transition-all duration-300" 
                        style={{ width: `${(subtasks.filter(s => s.isDone).length / subtasks.length) * 100}%` }}
                      ></div>
                    </div>
                  )}

                  <div className="space-y-2">
                    {subtasks.map((subtask) => (
                      <div key={subtask.id} className="flex items-center gap-3 p-2 hover:bg-secondary-50 rounded-lg group transition-colors">
                        <input
                          type="checkbox"
                          checked={subtask.isDone}
                          onChange={() => toggleSubtask(subtask.id, subtask.isDone)}
                          className="w-4 h-4 text-primary-600 rounded border-secondary-300 focus:ring-primary-500"
                        />
                        <span className={`flex-1 text-sm ${subtask.isDone ? 'text-secondary-400 line-through' : 'text-secondary-700'}`}>
                          {subtask.title}
                        </span>
                        <button 
                          onClick={() => handleDeleteSubtask(subtask.id)}
                          className="opacity-0 group-hover:opacity-100 p-1 text-secondary-400 hover:text-red-500 transition-all"
                        >
                          <X size={14} />
                        </button>
                      </div>
                    ))}

                    <form onSubmit={handleAddSubtask} className="mt-3 flex items-center gap-2">
                      <input
                        type="text"
                        value={newSubtaskTitle}
                        onChange={(e) => setNewSubtaskTitle(e.target.value)}
                        placeholder="Thêm công việc phụ mới..."
                        className="flex-1 text-sm bg-transparent border-none placeholder-secondary-400 focus:ring-0 py-1"
                      />
                      <button 
                        type="submit" 
                        disabled={!newSubtaskTitle.trim()}
                        className="p-1 text-primary-600 disabled:opacity-50"
                      >
                        <Plus size={18} />
                      </button>
                    </form>
                  </div>
                </div>
              </div>

              <div className="space-y-8">
                {/* Tags */}
                <div>
                  <h3 className="text-sm font-semibold text-secondary-900 uppercase tracking-wider mb-3 flex items-center gap-2">
                    <TagIcon size={14} /> Nhãn
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {tags.map((tag) => (
                      <span key={tag.id} className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium" style={{ backgroundColor: tag.color + '20', color: tag.color }}>
                        {tag.name}
                      </span>
                    ))}
                    {tags.length === 0 && (
                      <span className="text-secondary-400 text-sm">Chưa có nhãn nào.</span>
                    )}
                  </div>
                </div>

                {/* Details Meta */}
                <div className="bg-secondary-50/50 rounded-xl p-4 space-y-4">
                  <div>
                    <span className="block text-xs text-secondary-500 mb-1">Ngày tạo</span>
                    <span className="text-sm font-medium text-secondary-700">
                      {task.createdAt ? new Date(task.createdAt).toLocaleString() : 'N/A'}
                    </span>
                  </div>
                  <div>
                    <span className="block text-xs text-secondary-500 mb-1">Cập nhật cuối</span>
                    <span className="text-sm font-medium text-secondary-700">
                      {task.updatedAt ? new Date(task.updatedAt).toLocaleString() : 'N/A'}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default TaskDetailsModal;
