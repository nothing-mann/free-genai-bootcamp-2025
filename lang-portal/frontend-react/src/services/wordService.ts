import api from './api';

export interface WordsApiResponse {
  success: boolean;
  message: string;
  data: {
    words: {
      id: number;
      nepali_word: string;
      english_word: string;
      romanized_nepali_word: string;
      part_of_speech: string;
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

export interface WordApiResponse {
  success: boolean;
  message: string;
  data: {
    id: number;
    nepali_word: string;
    english_word: string;
    romanized_nepali_word: string;
    part_of_speech: string;
    word_groups?: {
      id: number;
      name: string;
      description: string;
      total_words: number;
    }[];
  };
  timestamp: string;
}

export interface WordGroupsApiResponse {
  success: boolean;
  message: string;
  data: {
    id: number;
    nepali_word: string;
    english_word: string;
    romanized_nepali_word: string;
    part_of_speech: string;
    word_groups: {
      id: number;
      name: string;
      description: string;
      total_words: number;
    }[];
  };
  timestamp: string;
}

/**
 * Get all words with pagination
 */
export const getWords = async (page = 1, pageSize = 20): Promise<WordsApiResponse> => {
  const response = await api.get('/words', {
    params: { page, per_page: pageSize },
  });
  return response.data;
};

/**
 * Get a specific word by ID
 */
export const getWord = async (id: string | number): Promise<WordApiResponse> => {
  const response = await api.get(`/words/${id}`);
  return response.data;
};

/**
 * Get groups that a specific word belongs to
 */
export const getWordGroups = async (id: string | number): Promise<WordGroupsApiResponse> => {
  const response = await api.get(`/words/${id}/groups`);
  return response.data;
};
