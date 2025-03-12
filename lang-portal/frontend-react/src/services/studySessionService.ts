import api from './api';
import { StudySession, WordReviewItem, PaginatedResponse } from '@/types';

export interface StudySessionsApiResponse {
  success: boolean;
  message: string;
  data: {
    study_sessions: {
      id: number;
      activity_name: string;
      group_id: number;
      group_name: string;
      study_activity_id: number;
      started_at: string;
      ended_at: string;
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

export interface StudySessionApiResponse {
  success: boolean;
  message: string;
  data: {
    id: number;
    activity_name: string;
    group_id: number;
    group_name: string;
    study_activity_id: number;
    started_at: string;
    ended_at: string;
  };
  timestamp: string;
}

export interface StudySessionWordsApiResponse {
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

export interface WordReviewResponse {
  success: boolean;
  message: string;
  id: number;
  word_id: number;
  session_id: number;
  group_id: number;
  is_correct: boolean;
  created_at: string;
}

/**
 * Get all study sessions with pagination
 */
export const getStudySessions = async (page = 1, pageSize = 10): Promise<StudySessionsApiResponse> => {
  const response = await api.get('/study-sessions', {
    params: { page, per_page: pageSize },
  });
  return response.data;
};

/**
 * Get a specific study session by ID
 */
export const getStudySession = async (id: string | number): Promise<StudySessionApiResponse> => {
  const response = await api.get(`/study-sessions/${id}`);
  return response.data;
};

/**
 * Get words reviewed during a specific study session with pagination
 */
export const getStudySessionWords = async (
  id: string | number,
  page = 1,
  pageSize = 10
): Promise<StudySessionWordsApiResponse> => {
  const response = await api.get(`/study-sessions/${id}/words`, {
    params: { page, per_page: pageSize },
  });
  return response.data;
};

/**
 * Submit a word review for a study session
 */
export const reviewWord = async (
  sessionId: string | number,
  wordId: string | number,
  isCorrect: boolean
): Promise<WordReviewResponse> => {
  const response = await api.post(`/study-sessions/${sessionId}/words/${wordId}/review`, {
    is_correct: isCorrect
  });
  return response.data;
};
