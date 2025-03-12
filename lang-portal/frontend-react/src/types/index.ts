// Common Pagination Response Type
export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  totalPages: number;
  pageSize: number;
}

// Word Types
export interface Word {
  id: number;
  nepali_word: string;
  romanized_nepali_word: string;
  english_word: string;
  part_of_speech: string;
}

export interface WordWithStats extends Word {
  correct_count: number;
  wrong_count: number;
}

// Group Types
export interface Group {
  id: number;
  name: string;
  description: string;
  created_at: string;
}

export interface GroupWithStats extends Group {
  correct_count: number;
  wrong_count: number;
}

// Study Activity Types
export interface StudyActivity {
  id: number;
  name: string;
  description: string;
  url: string;
  thumbnail: string;
}

// Study Session Types
export interface StudySession {
  id: number;
  activity_id: number;
  activity_name: string;
  group_id: number;
  group_name: string;
  start_time: string;
  end_time: string;
  review_items_count: number;
  correct_count: number;
  wrong_count: number;
}

export interface WordReviewItem {
  id: number;
  word_id: number;
  nepali_word: string;
  english_word: string;
  is_correct: boolean;
  timestamp: string;
}

// Dashboard Types
export interface DashboardStatistics {
  success_rate: number;
  study_sessions_count: number;
  active_groups_count: number;
  study_streak: number;
}

export interface StudyProgress {
  total_words_studied: number;
  total_study_time: number;
  mastery_progress: number;
}

export interface LastStudySession {
  session_id: number | null;
  group_id: number | null;
  group_name: string | null;
  total_words: number;
  correct_words: number;
  wrong_words: number;
}
