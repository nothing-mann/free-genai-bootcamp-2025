import { useQuery } from '@tanstack/react-query';
import { 
  getDashboardOverview,
  getDashboardStatistics, 
  getStudyProgress, 
  getLastStudySession,
  DashboardOverviewResponse,
  DashboardStatisticsResponse,
  StudyProgressResponse,
  LastStudySessionResponse
} from '@/services/dashboardService';

export const useDashboardOverview = () => {
  return useQuery<DashboardOverviewResponse, Error>({
    queryKey: ['dashboard', 'overview'],
    queryFn: getDashboardOverview,
  });
};

export const useDashboardStatistics = () => {
  return useQuery<DashboardStatisticsResponse, Error>({
    queryKey: ['dashboard', 'statistics'],
    queryFn: getDashboardStatistics,
  });
};

export const useStudyProgress = () => {
  return useQuery<StudyProgressResponse, Error>({
    queryKey: ['dashboard', 'study-progress'],
    queryFn: getStudyProgress,
  });
};

export const useLastStudySession = () => {
  return useQuery<LastStudySessionResponse, Error>({
    queryKey: ['dashboard', 'last-session'],
    queryFn: getLastStudySession,
    retry: false, // Don't retry if there's no last session
  });
};
