import { useMutation, useQueryClient } from '@tanstack/react-query';
import { resetHistory, fullReset } from '@/services/settingsService';

export const useResetHistory = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: resetHistory,
    onSuccess: () => {
      // Invalidate all study-related queries to refresh the data
      queryClient.invalidateQueries({ queryKey: ['studySessions'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard'] });
      
      // Individual words and groups might have study stats that need updating
      queryClient.invalidateQueries({ queryKey: ['word'] });
      queryClient.invalidateQueries({ queryKey: ['group'] });
    },
  });
};

export const useFullReset = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: fullReset,
    onSuccess: () => {
      // Invalidate all queries to refresh everything
      queryClient.invalidateQueries();
    },
  });
};
