import api from '../utils/api';

const getSubtasks = async (taskId) => {
  const response = await api.get(`/tasks/${taskId}/subtasks`);
  return response.data;
};

const createSubtask = async (taskId, subtaskData) => {
  const response = await api.post(`/tasks/${taskId}/subtasks`, subtaskData);
  return response.data;
};

const updateSubtask = async (id, subtaskData) => {
  const response = await api.put(`/subtasks/${id}`, subtaskData);
  return response.data;
};

const deleteSubtask = async (id) => {
  const response = await api.delete(`/subtasks/${id}`);
  return response.data;
};

export const subtaskService = {
  getSubtasks,
  createSubtask,
  updateSubtask,
  deleteSubtask,
};
