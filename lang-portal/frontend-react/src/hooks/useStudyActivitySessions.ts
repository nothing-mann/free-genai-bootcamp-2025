import { useQuery } from '@tanstack/react-query';
import { getStudyActivitySessions } from '@/services/studyActivityService';

export const useStudyActivitySessions = (id: string | number | undefined, page = 1, pageSize = 10) => {
  return useQuery({
    queryKey: ['studyActivity', id, 'sessions', page, pageSize],
    queryFn: () => {
      if (!id) throw new Error('Study Activity ID is required');
      return getStudyActivitySessions(id, page, pageSize);
    },
    enabled: !!id,
  });
};
