import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { LogOut, X } from 'lucide-react';

const LogoutConfirmModal = ({ isOpen, onClose, onConfirm }) => {
  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-secondary-900/40 backdrop-blur-sm"
        />

        {/* Modal */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="relative bg-white rounded-2xl shadow-2xl w-full max-w-sm overflow-hidden"
        >
          <div className="p-6">
            <div className="flex items-center justify-center w-12 h-12 rounded-full bg-red-100 text-red-600 mb-4 mx-auto">
              <LogOut size={24} />
            </div>
            
            <h3 className="text-xl font-bold text-secondary-900 text-center mb-2">
              Xác nhận đăng xuất
            </h3>
            <p className="text-secondary-500 text-center mb-6">
              Bạn có chắc chắn muốn đăng xuất khỏi ứng dụng không?
            </p>

            <div className="flex flex-col gap-3">
              <button
                onClick={onConfirm}
                className="w-full py-3 px-4 bg-red-600 hover:bg-red-700 text-white font-bold rounded-xl transition-colors shadow-lg shadow-red-200"
              >
                Đăng xuất ngay
              </button>
              <button
                onClick={onClose}
                className="w-full py-3 px-4 bg-secondary-50 hover:bg-secondary-100 text-secondary-700 font-bold rounded-xl transition-colors"
              >
                Hủy bỏ
              </button>
            </div>
          </div>

          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 text-secondary-400 hover:text-secondary-600 rounded-lg hover:bg-secondary-50 transition-colors"
          >
            <X size={20} />
          </button>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default LogoutConfirmModal;
