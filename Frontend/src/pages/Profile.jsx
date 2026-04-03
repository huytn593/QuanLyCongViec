import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-hot-toast';
import { Lock, Mail, User, ShieldCheck, Loader2 } from 'lucide-react';
import { motion } from 'framer-motion';

const Profile = () => {
  const { user, changePassword } = useAuth();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    oldPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.newPassword !== formData.confirmPassword) {
      return toast.error('Mật khẩu mới không khớp!');
    }
    if (formData.newPassword.length < 6) {
      return toast.error('Mật khẩu mới phải có ít nhất 6 ký tự!');
    }

    setLoading(true);
    try {
      await changePassword({
        oldPassword: formData.oldPassword,
        newPassword: formData.newPassword,
      });
      toast.success('Đổi mật khẩu thành công!');
      setFormData({
        oldPassword: '',
        newPassword: '',
        confirmPassword: '',
      });
    } catch (error) {
      toast.error(error.response?.data?.message || 'Đổi mật khẩu thất bại!');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-secondary-900">Hồ Sơ Của Tôi</h1>
        <p className="text-secondary-500 mt-1">Quản lý thông tin cá nhân và bảo mật tài khoản</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* User Info Card */}
        <div className="lg:col-span-1">
          <div className="card p-6 text-center">
            <div className="w-24 h-24 rounded-full bg-primary-100 text-primary-700 flex items-center justify-center font-bold text-3xl mx-auto mb-4">
              {user?.fullName?.charAt(0) || user?.name?.charAt(0) || 'U'}
            </div>
            <h3 className="text-xl font-bold text-secondary-900">{user?.fullName || user?.name}</h3>
            <p className="text-secondary-500 text-sm mb-6">{user?.email}</p>
            
            <div className="pt-6 border-t border-secondary-100 space-y-3">
              <div className="flex items-center gap-3 text-sm text-secondary-600">
                <ShieldCheck size={18} className="text-emerald-500" />
                <span>Tài khoản đã xác thực</span>
              </div>
            </div>
          </div>
        </div>

        {/* Change Password Form */}
        <div className="lg:col-span-2">
          <div className="card p-8">
            <div className="flex items-center gap-3 mb-8">
              <div className="p-2 bg-primary-50 text-primary-600 rounded-lg">
                <Lock size={20} />
              </div>
              <h3 className="text-xl font-bold text-secondary-900">Đổi Mật Khẩu</h3>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <label className="text-sm font-medium text-secondary-700 block">Mật khẩu hiện tại</label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-secondary-400 group-focus-within:text-primary-500 transition-colors">
                    <ShieldCheck size={18} />
                  </div>
                  <input
                    type="password"
                    required
                    value={formData.oldPassword}
                    onChange={(e) => setFormData({ ...formData, oldPassword: e.target.value })}
                    className="input-field pl-10"
                    placeholder="••••••••"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-secondary-700 block">Mật khẩu mới</label>
                  <div className="relative group">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-secondary-400 group-focus-within:text-primary-500 transition-colors">
                      <Lock size={18} />
                    </div>
                    <input
                      type="password"
                      required
                      value={formData.newPassword}
                      onChange={(e) => setFormData({ ...formData, newPassword: e.target.value })}
                      className="input-field pl-10"
                      placeholder="••••••••"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-secondary-700 block">Xác nhận mật khẩu</label>
                  <div className="relative group">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-secondary-400 group-focus-within:text-primary-500 transition-colors">
                      <Lock size={18} />
                    </div>
                    <input
                      type="password"
                      required
                      value={formData.confirmPassword}
                      onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                      className="input-field pl-10"
                      placeholder="••••••••"
                    />
                  </div>
                </div>
              </div>

              <div className="pt-4 flex justify-end">
                <button
                  type="submit"
                  disabled={loading}
                  className="btn-primary px-8 flex items-center gap-2"
                >
                  {loading ? (
                    <Loader2 className="animate-spin" size={20} />
                  ) : (
                    'Cập Nhật Mật Khẩu'
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
