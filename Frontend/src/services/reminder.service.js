import api from '../utils/api';

const createReminder = async (reminderData) => {
  const response = await api.post('/reminders', reminderData);
  return response.data;
};

export const reminderService = {
  createReminder,
};
