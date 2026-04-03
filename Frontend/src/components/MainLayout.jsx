import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { LayoutDashboard, CheckSquare, Tag as TagIcon, User as UserIcon, LogOut, Menu, X, Bell } from 'lucide-react';
import { useState, useEffect } from 'react';
import clsx from 'clsx';
import LogoutConfirmModal from './LogoutConfirmModal';
import { taskService } from '../services/task.service';
import toast from 'react-hot-toast';

const navItems = [
  { name: 'Trang chủ', path: '/', icon: LayoutDashboard },
  { name: 'Công việc', path: '/tasks', icon: CheckSquare },
  { name: 'Thông báo', path: '/notifications', icon: Bell },
  { name: 'Quản lý nhãn', path: '/tags', icon: TagIcon },
  { name: 'Hồ sơ', path: '/profile', icon: UserIcon },
];

const SidebarContent = ({ user, setLogoutModalOpen, upcomingCount }) => (
  <div className="flex flex-col h-full bg-white border-r border-secondary-200 shadow-sm w-64">
    <div className="h-16 flex items-center px-6 border-b border-secondary-100">
      <div className="flex items-center gap-2">
        <div className="w-8 h-8 rounded-lg bg-primary-600 text-white flex items-center justify-center font-bold">
          <CheckSquare size={20} />
        </div>
        <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary-600 to-primary-900">
          QLCV
        </span>
      </div>
    </div>

    <div className="flex-1 py-6 px-4 space-y-2">
      {navItems.map((item) => {
        const Icon = item.icon;
        return (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              clsx(
                'flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all group relative',
                isActive
                  ? 'bg-primary-50 text-primary-700'
                  : 'text-secondary-600 hover:bg-secondary-50 hover:text-secondary-900'
              )
            }
          >
            <Icon size={20} className="group-hover:scale-110 transition-transform" />
            <span className="flex-1">{item.name}</span>
            {item.name === 'Thông báo' && upcomingCount > 0 && (
              <span className="absolute right-4 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white ring-2 ring-white">
                {upcomingCount}
              </span>
            )}
          </NavLink>
        );
      })}
    </div>

    <div className="p-4 border-t border-secondary-100">
      <div className="flex items-center gap-3 px-4 py-3 mb-2">
        <div className="w-10 h-10 rounded-full bg-primary-100 text-primary-700 flex items-center justify-center font-bold text-lg">
          {user?.name?.charAt(0) || 'U'}
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold text-secondary-900 truncate">{user?.name}</p>
          <p className="text-xs text-secondary-500 truncate">{user?.email}</p>
        </div>
      </div>
      <button
        onClick={() => setLogoutModalOpen(true)}
        className="w-full flex items-center gap-3 px-4 py-3 rounded-xl font-medium text-red-600 hover:bg-red-50 transition-colors"
      >
        <LogOut size={20} />
        Đăng xuất
      </button>
    </div>
  </div>
);

const MainLayout = ({ children }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isLogoutModalOpen, setLogoutModalOpen] = useState(false);
  const [upcomingCount, setUpcomingCount] = useState(0);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  useEffect(() => {
    const checkUpcomingTasks = async () => {
      // Show only once per reload to avoid annoyance
      const notified = sessionStorage.getItem('notifiedUpcomingTasks');
      if (notified) return;

      try {
        const tasks = await taskService.getTasks();
        const now = new Date();
        const threeDaysFromNow = new Date(now.getTime() + (3 * 24 * 60 * 60 * 1000));
        
        const upcoming = tasks.filter(task => {
          if (!task.dueDate || task.status === 'DONE') return false;
          const dueDate = new Date(task.dueDate);
          return dueDate >= now && dueDate <= threeDaysFromNow;
        });

        if (upcoming.length > 0) {
          setUpcomingCount(upcoming.length);
          toast((t) => (
            <div className="flex flex-col gap-2">
              <p className="font-bold text-secondary-900">🔔 Bạn có {upcoming.length} công việc sắp đến hạn!</p>
              <ul className="text-sm text-secondary-600 list-disc pl-4">
                {upcoming.slice(0, 3).map(task => (
                  <li key={task.id} className="truncate max-w-[200px]">{task.title}</li>
                ))}
                {upcoming.length > 3 && <li>... và {upcoming.length - 3} việc khác</li>}
              </ul>
              <button 
                onClick={() => {
                  toast.dismiss(t.id);
                  navigate('/tasks');
                }}
                className="mt-2 text-xs font-bold text-primary-600 hover:text-primary-700 bg-primary-50 py-1.5 px-3 rounded-lg text-center transition-colors"
              >
                Xem chi tiết
              </button>
            </div>
          ), {
            duration: 6000,
            position: 'top-right',
            style: {
              background: '#fff',
              color: '#333',
              padding: '16px',
              borderRadius: '16px',
              boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)',
            },
          });
          sessionStorage.setItem('notifiedUpcomingTasks', 'true');
        }
      } catch (error) {
        console.error('Failed to check upcoming tasks:', error);
      }
    };

    if (user) {
      checkUpcomingTasks();
    }
  }, [user, navigate]);

  return (
    <div className="min-h-screen flex bg-secondary-50">
      {/* Desktop Sidebar */}
      <div className="hidden md:block fixed inset-y-0 left-0 z-50">
        <SidebarContent user={user} setLogoutModalOpen={setLogoutModalOpen} upcomingCount={upcomingCount} />
      </div>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-secondary-900/50 z-40 md:hidden backdrop-blur-sm"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Mobile Sidebar */}
      <div className={clsx(
        "fixed inset-y-0 left-0 z-50 transform transition-transform duration-300 ease-in-out md:hidden",
        isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"
      )}>
        <SidebarContent user={user} setLogoutModalOpen={setLogoutModalOpen} upcomingCount={upcomingCount} />
      </div>

      <div className="flex-1 md:pl-64 flex flex-col min-h-screen">
        {/* Mobile Header */}
        <div className="md:hidden h-16 bg-white border-b border-secondary-200 flex items-center px-4 justify-between sticky top-0 z-30 shadow-sm">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-primary-600 text-white flex items-center justify-center font-bold">
              <CheckSquare size={20} />
            </div>
            <span className="text-xl font-bold text-primary-900">QLCV</span>
          </div>
          <button 
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="p-2 text-secondary-600 hover:bg-secondary-100 rounded-lg transition-colors"
          >
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Main Content */}
        <main className="flex-1 p-6 relative">
          <div className="max-w-7xl mx-auto">
            {children}
          </div>
        </main>
      </div>

      <LogoutConfirmModal
        isOpen={isLogoutModalOpen}
        onClose={() => setLogoutModalOpen(false)}
        onConfirm={handleLogout}
      />
    </div>
  );
};

export default MainLayout;
