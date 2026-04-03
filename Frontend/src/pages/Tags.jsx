import React, { useState, useEffect } from 'react';
import { tagService } from '../services/tag.service';
import { Plus, Tag as TagIcon, Pencil, Trash2, X, Check } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';

const Tags = () => {
  const [tags, setTags] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTag, setEditingTag] = useState(null);
  const [formData, setFormData] = useState({ name: '', color: '#3b82f6' });

  const colors = [
    '#3b82f6', '#ef4444', '#10b981', '#f59e0b', '#8b5cf6', 
    '#ec4899', '#64748b', '#2dd4bf', '#fb923c', '#a855f7'
  ];

  useEffect(() => {
    fetchTags();
  }, []);

  const fetchTags = async () => {
    try {
      const data = await tagService.getTags();
      setTags(data);
    } catch (error) {
      console.error(error);
      toast.error('Không thể tải nhãn');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingTag) {
        await tagService.updateTag(editingTag.id, formData);
        toast.success('Đã cập nhật nhãn');
      } else {
        await tagService.createTag(formData);
        toast.success('Đã tạo nhãn mới');
      }
      setIsModalOpen(false);
      setEditingTag(null);
      setFormData({ name: '', color: '#3b82f6' });
      fetchTags();
    } catch (error) {
      console.error(error);
      toast.error('Thao tác thất bại');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa nhãn này?')) {
      try {
        await tagService.deleteTag(id);
        toast.success('Đã xóa nhãn');
        fetchTags();
      } catch (error) {
        console.error(error);
        toast.error('Xóa nhãn thất bại');
      }
    }
  };

  const openEdit = (tag) => {
    setEditingTag(tag);
    setFormData({ name: tag.name, color: tag.color });
    setIsModalOpen(true);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-secondary-900">Quản Lý Nhãn</h1>
          <p className="text-secondary-500 mt-1">Phân loại công việc của bạn với các nhãn màu sắc</p>
        </div>
        <button
          onClick={() => { setEditingTag(null); setFormData({ name: '', color: '#3b82f6' }); setIsModalOpen(true); }}
          className="btn-primary flex items-center gap-2"
        >
          <Plus size={20} />
          Nhãn Mới
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {tags.map((tag) => (
          <motion.div
            layout
            key={tag.id}
            className="card p-4 flex items-center justify-between group"
          >
            <div className="flex items-center gap-3">
              <div 
                className="w-4 h-4 rounded-full" 
                style={{ backgroundColor: tag.color }}
              />
              <span className="font-medium text-secondary-900">{tag.name}</span>
            </div>
            <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
              <button 
                onClick={() => openEdit(tag)}
                className="p-1.5 text-secondary-400 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-colors"
              >
                <Pencil size={16} />
              </button>
              <button 
                onClick={() => handleDelete(tag.id)}
                className="p-1.5 text-secondary-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
              >
                <Trash2 size={16} />
              </button>
            </div>
          </motion.div>
        ))}
        {tags.length === 0 && (
          <div className="col-span-full py-12 text-center text-secondary-500 bg-secondary-100/50 rounded-2xl border-2 border-dashed border-secondary-200">
            <TagIcon size={48} className="mx-auto mb-4 opacity-20" />
            <p>Chưa có nhãn nào. Hãy tạo nhãn mới để bắt đầu!</p>
          </div>
        )}
      </div>

      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-secondary-900/40 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-2xl w-full max-w-md shadow-2xl overflow-hidden"
            >
              <div className="flex justify-between items-center p-6 border-b border-secondary-100">
                <h2 className="text-xl font-bold text-secondary-900">
                  {editingTag ? 'Sửa Nhãn' : 'Tạo Nhãn Mới'}
                </h2>
                <button onClick={() => setIsModalOpen(false)} className="text-secondary-400 hover:text-secondary-600">
                  <X size={20} />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="p-6 space-y-6">
                <div>
                  <label className="block text-sm font-medium text-secondary-700 mb-2">Tên nhãn</label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="input-field"
                    placeholder="VD: Quan trọng, Gấp..."
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-secondary-700 mb-3">Màu sắc</label>
                  <div className="flex flex-wrap gap-3">
                    {colors.map((color) => (
                      <button
                        key={color}
                        type="button"
                        onClick={() => setFormData({ ...formData, color })}
                        className={`w-8 h-8 rounded-full flex items-center justify-center transition-transform hover:scale-110 ${
                          formData.color === color ? 'ring-2 ring-offset-2 ring-primary-500' : ''
                        }`}
                        style={{ backgroundColor: color }}
                      >
                        {formData.color === color && <Check size={16} className="text-white" />}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="pt-4 flex justify-end gap-3 border-t border-secondary-100">
                  <button type="button" onClick={() => setIsModalOpen(false)} className="btn-secondary">
                    Hủy
                  </button>
                  <button type="submit" className="btn-primary">
                    {editingTag ? 'Lưu Thay Đổi' : 'Tạo Nhãn'}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Tags;
