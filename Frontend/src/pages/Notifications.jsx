import React, { useState, useEffect } from 'react';
import { Bell, Calendar, ChevronRight, AlertCircle } from 'lucide-react';
import { taskService } from '../services/task.service';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

const Notifications = () => {
  const [upcomingTasks, setUpcomingTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUpcoming = async () => {
      try {
        const tasks = await taskService.getTasks();
        const now = new Date();
        const threeDaysFromNow = new Date(now.getTime() + (3 * 24 * 60 * 60 * 1000));
        
        const upcoming = tasks.filter(task => {
          if (!task.dueDate || task.status === 'DONE') return false;
          const dueDate = new Date(task.dueDate);
          return dueDate >= now && dueDate <= threeDaysFromNow;
        });
        
        setUpcomingTasks(upcoming.sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate)));
      } catch (error) {
        console.error('Failed to fetch notifications:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchUpcoming();
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3 mb-8">
        <div className="p-3 bg-primary-100 text-primary-600 rounded-2xl">
          <Bell size={28} />
        </div>
        <div>
          <h1 className="text-3xl font-bold text-secondary-900">Thông báo</h1>
          <p className="text-secondary-500">Các công việc sắp đến hạn trong vòng 3 ngày tới</p>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
        </div>
      ) : upcomingTasks.length > 0 ? (
        <div className="grid gap-4">
          {upcomingTasks.map((task, index) => (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              key={task.id}
              onClick={() => navigate('/tasks')}
              className="bg-white p-5 rounded-2xl border border-secondary-100 shadow-sm hover:shadow-md hover:border-primary-200 transition-all cursor-pointer group"
            >
              <div className="flex items-start gap-4">
                <div className={`p-2 rounded-xl flex-shrink-0 ${
                  task.priority === 'HIGH' ? 'bg-red-50 text-red-600' :
                  task.priority === 'MEDIUM' ? 'bg-amber-50 text-amber-600' :
                  'bg-blue-50 text-blue-600'
                }`}>
                  <AlertCircle size={20} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-start mb-1">
                    <h3 className="font-bold text-secondary-900 group-hover:text-primary-600 transition-colors">
                      {task.title}
                    </h3>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-secondary-100 text-secondary-600 uppercase tracking-wider">
                      {task.priority === 'HIGH' ? 'Cao' : task.priority === 'MEDIUM' ? 'Trung bình' : 'Thấp'}
                    </span>
                  </div>
                  <p className="text-sm text-secondary-500 mb-3 line-clamp-1">{task.description}</p>
                  <div className="flex items-center gap-4 text-xs font-medium">
                    <span className="flex items-center gap-1.5 text-amber-600 bg-amber-50 px-2 py-1 rounded-lg">
                      <Calendar size={14} />
                      Đến hạn: {new Date(task.dueDate).toLocaleDateString('vi-VN')}
                    </span>
                    <span className="text-secondary-400 flex items-center gap-1">
                      Tiến độ: <span className="text-secondary-700">{Math.round(task.progress || 0)}%</span>
                    </span>
                  </div>
                </div>
                <ChevronRight className="text-secondary-300 group-hover:text-primary-500 transition-colors self-center" size={20} />
              </div>
            </motion.div>
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-3xl p-12 text-center border border-dashed border-secondary-200">
          <div className="w-16 h-16 bg-secondary-50 text-secondary-300 rounded-full flex items-center justify-center mx-auto mb-4">
            <Bell size={32} />
          </div>
          <h3 className="text-lg font-bold text-secondary-900 mb-1">Tuyệt vời!</h3>
          <p className="text-secondary-500">Hiện tại không có công việc nào sắp đến hạn.</p>
        </div>
      )}
    </div>
  );
};

export default Notifications;
