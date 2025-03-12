import { useQuery } from '@tanstack/react-query';
import { getWordGroups } from '@/services/wordService';

export const useWordGroups = (id: string | number | undefined) => {
  return useQuery({
    queryKey: ['word', id, 'groups'],
    queryFn: () => {
      if (!id) throw new Error('Word ID is required');
      return getWordGroups(id);
    },
    enabled: !!id,
  });
};
