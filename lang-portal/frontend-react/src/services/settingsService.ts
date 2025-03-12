import api from './api';

export const resetHistory = async (): Promise<{ success: boolean; message: string }> => {
  const response = await api.post('/reset-history');
  return response.data;
};

export const fullReset = async (): Promise<{ success: boolean; message: string }> => {
  const response = await api.post('/full-reset');
  return response.data;
};
