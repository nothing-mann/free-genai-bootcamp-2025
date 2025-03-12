import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { 
  getStudySessions, 
  getStudySession, 
  getStudySessionWords, 
  reviewWord,
  StudySessionsApiResponse,
  StudySessionApiResponse,
  StudySessionWordsApiResponse,
  WordReviewResponse
} from '@/services/studySessionService';

export const useStudySessions = (page = 1, pageSize = 10) => {
  return useQuery<StudySessionsApiResponse, Error>({
    queryKey: ['studySessions', page, pageSize],
    queryFn: () => getStudySessions(page, pageSize),
  });
};

export const useStudySession = (id: string | number | undefined) => {
  return useQuery<StudySessionApiResponse, Error>({
    queryKey: ['studySession', id],
    queryFn: () => {
      if (!id) throw new Error('Study Session ID is required');
      return getStudySession(id);
    },
    enabled: !!id,
  });
};

export const useStudySessionWords = (id: string | number | undefined, page = 1, pageSize = 100) => {
  return useQuery<StudySessionWordsApiResponse, Error>({
    queryKey: ['studySession', id, 'words', page, pageSize],
    queryFn: () => {
      if (!id) throw new Error('Study Session ID is required');
      return getStudySessionWords(id, page, pageSize);
    },
    enabled: !!id,
  });
};

export const useReviewWord = () => {
  const queryClient = useQueryClient();
  
  return useMutation<
    WordReviewResponse, 
    Error, 
    { sessionId: string | number, wordId: string | number, isCorrect: boolean }
  >({
    mutationFn: ({ sessionId, wordId, isCorrect }) => 
      reviewWord(sessionId, wordId, isCorrect),
    onSuccess: (_, variables) => {
      // Invalidate relevant queries to refresh the data
      queryClient.invalidateQueries({ 
        queryKey: ['studySession', variables.sessionId, 'words'] 
      });
      queryClient.invalidateQueries({ 
        queryKey: ['studySession', variables.sessionId] 
      });
    },
  });
};
