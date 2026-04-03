import api from '../utils/api';

const getTags = async () => {
  const response = await api.get('/tags');
  return response.data;
};

const createTag = async (tagData) => {
  const response = await api.post('/tags', tagData);
  return response.data;
};

const updateTag = async (id, tagData) => {
  const response = await api.put(`/tags/${id}`, tagData);
  return response.data;
};

const deleteTag = async (id) => {
  const response = await api.delete(`/tags/${id}`);
  return response.data;
};

export const tagService = {
  getTags,
  createTag,
  updateTag,
  deleteTag,
};
