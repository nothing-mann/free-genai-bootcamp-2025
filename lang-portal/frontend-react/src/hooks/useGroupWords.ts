import { useQuery } from '@tanstack/react-query';
import { getGroupWords } from '@/services/groupService';

export const useGroupWords = (id: string | number | undefined, page = 1, pageSize = 100) => {
  return useQuery({
    queryKey: ['group', id, 'words', page, pageSize],
    queryFn: () => {
      if (!id) throw new Error('Group ID is required');
      return getGroupWords(id, page, pageSize);
    },
    enabled: !!id,
  });
};
