import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { 
  getStudyActivities, 
  getStudyActivity, 
  getStudyActivitySessions,
  launchStudyActivity,
  StudyActivitiesApiResponse,
  StudyActivityApiResponse,
  StudyActivitySessionsResponse,
  LaunchStudyActivityResponse
} from '@/services/studyActivityService';

export const useStudyActivities = () => {
  return useQuery<StudyActivitiesApiResponse, Error>({
    queryKey: ['studyActivities'],
    queryFn: () => getStudyActivities(),
  });
};

export const useStudyActivity = (id: string | number | undefined) => {
  return useQuery<StudyActivityApiResponse, Error>({
    queryKey: ['studyActivity', id],
    queryFn: () => {
      if (!id) throw new Error('Study Activity ID is required');
      return getStudyActivity(id);
    },
    enabled: !!id,
  });
};

export const useStudyActivitySessions = (id: string | number | undefined, page = 1, pageSize = 10) => {
  return useQuery<StudyActivitySessionsResponse, Error>({
    queryKey: ['studyActivity', id, 'sessions', page, pageSize],
    queryFn: () => {
      if (!id) throw new Error('Study Activity ID is required');
      return getStudyActivitySessions(id, page, pageSize);
    },
    enabled: !!id,
  });
};

export const useLaunchStudyActivity = () => {
  const queryClient = useQueryClient();
  
  return useMutation<
    LaunchStudyActivityResponse, 
    Error, 
    { activityId: string | number, groupId: string | number }
  >({
    mutationFn: ({ activityId, groupId }) => 
      launchStudyActivity(activityId, groupId),
    onSuccess: () => {
      // Invalidate study sessions query to refresh the data
      queryClient.invalidateQueries({ queryKey: ['studySessions'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard'] });
    },
  });
};
