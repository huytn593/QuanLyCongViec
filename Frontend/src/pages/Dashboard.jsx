import React, { useState, useEffect } from 'react';
import { taskService } from '../services/task.service';
import { CheckCircle2, Clock, ListTodo, AlertCircle, TrendingUp } from 'lucide-react';
import { motion } from 'framer-motion';
import { 
  PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend,
  BarChart, Bar, XAxis, YAxis, CartesianGrid
} from 'recharts';

const Dashboard = () => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      const data = await taskService.getTasks();
      setTasks(data || []);
    } catch (error) {
      console.error('Failed to fetch tasks', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-primary-600"></div>
      </div>
    );
  }

  const totalTasks = tasks.length;
  const completedTasks = tasks.filter(t => t.status === 'DONE').length;
  const inProgressTasks = tasks.filter(t => t.status === 'IN_PROGRESS').length;
  const todoTasks = tasks.filter(t => t.status === 'TODO' || t.status === 'OVERDUE').length;
  
  const overdueTasks = tasks.filter(t => {
    if (!t.dueDate) return false;
    return new Date(t.dueDate) < new Date() && t.status !== 'DONE';
  }).length;

  const stats = [
    { title: 'Tổng công việc', value: totalTasks, icon: ListTodo, color: 'text-blue-600', bg: 'bg-blue-50' },
    { title: 'Đang thực hiện', value: inProgressTasks, icon: Clock, color: 'text-amber-600', bg: 'bg-amber-50' },
    { title: 'Đã hoàn thành', value: completedTasks, icon: CheckCircle2, color: 'text-emerald-600', bg: 'bg-emerald-50' },
    { title: 'Quá hạn', value: overdueTasks, icon: AlertCircle, color: 'text-red-600', bg: 'bg-red-50' },
  ];

  // Data for Charts
  const statusData = [
    { name: 'Cần làm', value: todoTasks, color: '#3b82f6' },
    { name: 'Đang thực hiện', value: inProgressTasks, color: '#f59e0b' },
    { name: 'Hoàn thành', value: completedTasks, color: '#10b981' },
  ].filter(d => d.value > 0);

  const priorityData = [
    { name: 'Cao', value: tasks.filter(t => t.priority === 'HIGH').length, color: '#ef4444' },
    { name: 'Trung bình', value: tasks.filter(t => t.priority === 'MEDIUM').length, color: '#f59e0b' },
    { name: 'Thấp', value: tasks.filter(t => t.priority === 'LOW').length, color: '#3b82f6' },
  ];

  return (
    <div className="space-y-8 pb-12">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-secondary-900 tracking-tight">Trang chủ</h1>
          <p className="text-secondary-500 mt-1 font-medium">Chào mừng trở lại! Đây là tổng quan công việc của bạn.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <motion.div
              key={stat.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white p-6 rounded-3xl border border-secondary-100 shadow-sm flex items-center gap-4 hover:shadow-md transition-shadow"
            >
              <div className={`p-4 rounded-2xl ${stat.bg} ${stat.color}`}>
                <Icon size={24} />
              </div>
              <div>
                <p className="text-xs font-bold text-secondary-400 uppercase tracking-wider">{stat.title}</p>
                <p className="text-2xl font-black text-secondary-900 leading-none mt-1">{stat.value}</p>
              </div>
            </motion.div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Status Chart */}
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white p-8 rounded-3xl border border-secondary-100 shadow-sm"
        >
          <h3 className="text-lg font-bold text-secondary-900 mb-6 flex items-center gap-2">
            <TrendingUp size={20} className="text-primary-600" /> Phân bổ trạng thái
          </h3>
          <div className="h-[300px] w-full">
            {totalTasks > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={statusData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={100}
                    paddingAngle={8}
                    dataKey="value"
                  >
                    {statusData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} strokeWidth={0} />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }}
                  />
                  <Legend verticalAlign="bottom" height={36}/>
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex items-center justify-center text-secondary-400 text-sm italic">
                Cần có dữ liệu để hiển thị biểu đồ.
              </div>
            )}
          </div>
        </motion.div>

        {/* Priority Chart */}
        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-white p-8 rounded-3xl border border-secondary-100 shadow-sm"
        >
          <h3 className="text-lg font-bold text-secondary-900 mb-6 flex items-center gap-2">
            <AlertCircle size={20} className="text-primary-600" /> Mức độ ưu tiên
          </h3>
          <div className="h-[300px] w-full">
            {totalTasks > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={priorityData} margin={{ top: 20, right: 30, left: 0, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis 
                    dataKey="name" 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{ fill: '#94a3b8', fontSize: 12 }} 
                  />
                  <YAxis 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{ fill: '#94a3b8', fontSize: 12 }} 
                  />
                  <Tooltip 
                    cursor={{ fill: 'transparent' }}
                    contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }}
                  />
                  <Bar 
                    dataKey="value" 
                    fill="#3b82f6" 
                    radius={[6, 6, 0, 0]} 
                    barSize={40}
                  >
                    {priorityData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex items-center justify-center text-secondary-400 text-sm italic">
                Cần có dữ liệu để hiển thị biểu đồ.
              </div>
            )}
          </div>
        </motion.div>
      </div>

      {/* Recent Tasks */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="mt-10 bg-white rounded-3xl border border-secondary-100 shadow-sm overflow-hidden"
      >
        <div className="p-8 border-b border-secondary-50">
          <h2 className="text-xl font-bold text-secondary-900">Công việc gần đây</h2>
        </div>
        <div className="divide-y divide-secondary-50">
          {tasks.slice(0, 5).map((task, index) => (
            <div
              key={task.id}
              className="p-6 flex items-center justify-between hover:bg-secondary-50/50 transition-colors cursor-pointer"
            >
              <div className="flex items-center gap-4">
                <div className={`w-2 h-2 rounded-full ${
                  task.status === 'DONE' ? 'bg-emerald-500' :
                  task.status === 'IN_PROGRESS' ? 'bg-amber-500' :
                  'bg-blue-500'
                }`}></div>
                <div>
                  <h3 className="font-bold text-secondary-900 group-hover:text-primary-600 transition-colors">{task.title}</h3>
                  <p className="text-xs text-secondary-500 font-medium">{task.description || 'Không có mô tả'}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <span className={`px-3 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider ${
                  task.status === 'DONE' ? 'bg-emerald-50 text-emerald-600' :
                  task.status === 'IN_PROGRESS' ? 'bg-amber-50 text-amber-600' :
                  'bg-blue-50 text-blue-600'
                }`}>
                  {task.status === 'DONE' ? 'Hoàn thành' : task.status === 'IN_PROGRESS' ? 'Đang thực hiện' : 'Cần làm'}
                </span>
              </div>
            </div>
          ))}
          {tasks.length === 0 && (
            <div className="p-12 text-center text-secondary-400 text-sm">
              Không có công việc nào.
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
};

export default Dashboard;
