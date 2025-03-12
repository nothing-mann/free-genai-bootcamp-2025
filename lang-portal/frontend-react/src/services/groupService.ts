import api from './api';
import { Group, PaginatedResponse, Word, StudySession } from '@/types';

// API response types
export interface GroupsApiResponse {
  success: boolean;
  message: string;
  data: {
    word_groups: {
      id: number;
      name: string;
      description: string;
      total_words: number;
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

export interface GroupApiResponse {
  success: boolean;
  message: string;
  data: {
    id: number;
    name: string;
    description: string;
    statistics: {
      correct_count: number;
      total_count: number;
      wrong_count: number;
    }
  };
  timestamp: string;
}

export interface GroupWordsApiResponse {
  success: boolean;
  message: string;
  data: {
    words: {
      id: number;
      nepali_word: string;
      english_word: string;
      romanized_nepali_word: string;
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

export interface GroupStudySessionsApiResponse {
  success: boolean;
  message: string;
  data: {
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

/**
 * Get all word groups with pagination
 */
export const getGroups = async (page = 1, pageSize = 20): Promise<GroupsApiResponse> => {
  const response = await api.get('/groups', {
    params: { page, per_page: pageSize },
  });
  return response.data;
};

/**
 * Get a specific word group by ID
 */
export const getGroup = async (id: string | number): Promise<GroupApiResponse> => {
  const response = await api.get(`/groups/${id}`);
  return response.data;
};

/**
 * Get words belonging to a specific group with pagination
 */
export const getGroupWords = async (
  id: string | number,
  page = 1,
  pageSize = 20
): Promise<GroupWordsApiResponse> => {
  const response = await api.get(`/groups/${id}/words`, {
    params: { page, per_page: pageSize },
  });
  return response.data;
};

/**
 * Get study sessions for a specific group
 */
export const getGroupStudySessions = async (
  id: string | number,
  page = 1,
  pageSize = 20
): Promise<GroupStudySessionsApiResponse> => {
  const response = await api.get(`/groups/${id}/study-sessions`, {
    params: { page, per_page: pageSize },
  });
  return response.data;
};
