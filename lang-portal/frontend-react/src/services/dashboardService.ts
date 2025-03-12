import api from './api';

// API response types
export interface DashboardOverviewResponse {
  success: boolean;
  message: string;
  data: {
    total_groups: number;
    total_study_sessions: number;
    total_words: number;
  };
  timestamp: string;
}

export interface DashboardStatisticsResponse {
  success: boolean;
  message: string;
  data: {
    average_score: number;
    study_sessions_completed: number;
    total_reviews: number;
    words_learned: number;
  };
  timestamp: string;
}

export interface StudyProgressResponse {
  success: boolean;
  message: string;
  data: {
    progress: {
      total_activities: number;
      total_sessions: number;
      total_words_studied: number;
    };
  };
  timestamp: string;
}

export interface LastStudySessionResponse {
  success: boolean;
  message: string;
  data: {
    id: number;
    started_at: string;
    ended_at: string;
    score: number;
  };
  timestamp: string;
}

export const getDashboardOverview = async (): Promise<DashboardOverviewResponse> => {
  const response = await api.get('/dashboard');
  return response.data;
};

export const getDashboardStatistics = async (): Promise<DashboardStatisticsResponse> => {
  const response = await api.get('/dashboard/statistics');
  return response.data;
};

export const getStudyProgress = async (): Promise<StudyProgressResponse> => {
  const response = await api.get('/dashboard/study-progress');
  return response.data;
};

export const getLastStudySession = async (): Promise<LastStudySessionResponse> => {
  const response = await api.get('/dashboard/last-session');
  return response.data;
};
