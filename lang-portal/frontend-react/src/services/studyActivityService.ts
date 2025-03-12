import api from './api';

export interface StudyActivitiesApiResponse {
  success: boolean;
  message: string;
  data: {
    study_activities: {
      id: number;
      name: string;
      description: string;
      instructions: string;
      thumbnail: string;
    }[];
  };
  meta: {
    pagination: {
      page: number;
      per_page: number;
      total_items: number;
      total_pages: number;
      has_next: boolean;
      has_previous: boolean;
    }
  };
  timestamp: string;
}

export interface StudyActivityApiResponse {
  success: boolean;
  message: string;
  data: {
    id: number;
    name: string;
    description: string;
    instructions: string;
    thumbnail: string;
  };
  timestamp: string;
}

export interface StudyActivitySessionsResponse {
  pagination: {
    page: number;
    per_page: number;
    total_pages: number;
    has_next: boolean;
    has_previous: boolean;
  };
  study_sessions: {
    id: number;
    activity_name: string;
    group_name: string;
    started_at: string;
    ended_at: string;
    number_of_review_items: number;
    number_of_correct_review_items: number;
    number_of_wrong_review_items: number;
  }[];
}

export interface LaunchStudyActivityResponse {
  id: number;
  message: string;
  group_id: number;
  study_activity_id: number;
}

/**
 * Get all study activities
 */
export const getStudyActivities = async (): Promise<StudyActivitiesApiResponse> => {
  const response = await api.get('/study-activities');
  return response.data;
};

/**
 * Get a specific study activity by ID
 */
export const getStudyActivity = async (id: string | number): Promise<StudyActivityApiResponse> => {
  const response = await api.get(`/study-activities/${id}`);
  return response.data;
};

/**
 * Get study sessions for a specific activity
 */
export const getStudyActivitySessions = async (
  id: string | number,
  page = 1,
  pageSize = 20
): Promise<StudyActivitySessionsResponse> => {
  const response = await api.get(`/study-activities/${id}/study-sessions`, {
    params: { page, per_page: pageSize },
  });
  return response.data;
};

/**
 * Launch a study activity with a specific group
 */
export const launchStudyActivity = async (
  activityId: string | number,
  groupId: string | number
): Promise<LaunchStudyActivityResponse> => {
  const response = await api.post(`/study-activities`, {
    study_activity_id: activityId,
    group_id: groupId,
  });
  return response.data;
};
