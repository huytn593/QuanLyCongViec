import React, { useState, useEffect } from 'react';
import { X, Tag as TagIcon } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';
import { tagService } from '../../services/tag.service';

const TaskFormModal = ({ isOpen, onClose, onSubmit, initialData }) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    status: 'TODO',
    priority: 'MEDIUM',
    dueDate: '',
    tags: [],
  });
  const [availableTags, setAvailableTags] = useState([]);

  useEffect(() => {
    const fetchTags = async () => {
      try {
        const data = await tagService.getTags();
        setAvailableTags(data);
      } catch (error) {
        console.error('Failed to fetch tags:', error);
      }
    };
    fetchTags();
  }, []);

  useEffect(() => {
    if (initialData) {
      // eslint-disable-next-line react-hooks/exhaustive-deps
      setFormData({
        title: initialData.title || '',
        description: initialData.description || '',
        status: initialData.status || 'TODO',
        priority: initialData.priority || 'MEDIUM',
        dueDate: initialData.dueDate ? initialData.dueDate.split('T')[0] : '',
        tags: initialData.tags || [],
      });
    } else {
      setFormData({
        title: '',
        description: '',
        status: 'TODO',
        priority: 'MEDIUM',
        dueDate: '',
        tags: [],
      });
    }
  }, [initialData, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    
    let formattedDate = null;
    if (formData.dueDate) {
      const date = new Date(formData.dueDate);
      if (!isNaN(date.getTime())) {
        formattedDate = date.toISOString();
      }
    }

    onSubmit({
      ...formData,
      dueDate: formattedDate,
    });
  };

  const toggleTag = (tagId) => {
    const newTags = formData.tags.includes(tagId)
      ? formData.tags.filter(id => id !== tagId)
      : [...formData.tags, tagId];
    setFormData({ ...formData, tags: newTags });
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-secondary-900/40 backdrop-blur-sm">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="bg-white rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden"
        >
          <div className="flex justify-between items-center p-6 border-b border-secondary-100">
            <h2 className="text-xl font-bold text-secondary-900">
              {initialData ? 'Sửa Công Việc' : 'Tạo Công Việc Mới'}
            </h2>
            <button
              onClick={onClose}
              className="text-secondary-400 hover:text-secondary-600 transition-colors p-2 rounded-lg hover:bg-secondary-50"
            >
              <X size={20} />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="p-6 space-y-4">
            <div>
              <label className="block text-sm font-medium text-secondary-700 mb-1">Tiêu đề</label>
              <input
                type="text"
                required
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="input-field"
                placeholder="Tiêu đề công việc"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-secondary-700 mb-1">Mô tả</label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="input-field min-h-[100px] resize-y"
                placeholder="Mô tả chi tiết..."
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-secondary-700 mb-1">Trạng thái</label>
                <select
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                  className="input-field"
                >
                  <option value="TODO">Cần làm</option>
                  <option value="IN_PROGRESS">Đang thực hiện</option>
                  <option value="DONE">Hoàn thành</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-secondary-700 mb-1">Mức độ ưu tiên</label>
                <select
                  value={formData.priority}
                  onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
                  className="input-field"
                >
                  <option value="LOW">Thấp</option>
                  <option value="MEDIUM">Trung bình</option>
                  <option value="HIGH">Cao</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-secondary-700 mb-1">Hạn chót</label>
              <input
                type="date"
                value={formData.dueDate}
                onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
                className="input-field"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-secondary-700 mb-1 flex items-center gap-2">
                <TagIcon size={14} /> Nhãn
              </label>
              <div className="flex flex-wrap gap-2 p-3 bg-secondary-50 rounded-xl border border-secondary-100 min-h-[46px]">
                {availableTags.map((tag) => (
                  <button
                    key={tag.id}
                    type="button"
                    onClick={() => toggleTag(tag.id)}
                    className={`px-3 py-1 rounded-full text-xs font-medium transition-all ${
                      formData.tags.includes(tag.id)
                        ? 'ring-2 ring-offset-1'
                        : 'opacity-60 grayscale hover:opacity-100 hover:grayscale-0'
                    }`}
                    style={{ 
                      backgroundColor: tag.color + '20', 
                      color: tag.color,
                      borderColor: tag.color,
                      borderWidth: formData.tags.includes(tag.id) ? '1px' : '0px'
                    }}
                  >
                    {tag.name}
                  </button>
                ))}
                {availableTags.length === 0 && (
                  <span className="text-secondary-400 text-xs py-1">Không có nhãn nào.</span>
                )}
              </div>
            </div>

            <div className="pt-4 flex justify-end gap-3 mt-6 border-t border-secondary-100 pl-4 py-4">
              <button
                type="button"
                onClick={onClose}
                className="btn-secondary"
              >
                Hủy
              </button>
              <button
                type="submit"
                className="btn-primary"
              >
                {initialData ? 'Lưu Thay Đổi' : 'Tạo Công Việc'}
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default TaskFormModal;
