import { useQuery } from '@tanstack/react-query';
import { 
  getWords, 
  getWord, 
  getWordGroups,
  WordsApiResponse,
  WordApiResponse,
  WordGroupsApiResponse
} from '@/services/wordService';

export const useWords = (page = 1, pageSize = 100) => {
  return useQuery<WordsApiResponse, Error>({
    queryKey: ['words', page, pageSize],
    queryFn: () => getWords(page, pageSize),
  });
};

export const useWord = (id: string | number | undefined) => {
  return useQuery<WordApiResponse, Error>({
    queryKey: ['word', id],
    queryFn: () => {
      if (!id) throw new Error('Word ID is required');
      return getWord(id);
    },
    enabled: !!id,
  });
};

export const useWordGroups = (id: string | number | undefined) => {
  return useQuery<WordGroupsApiResponse, Error>({
    queryKey: ['word', id, 'groups'],
    queryFn: () => {
      if (!id) throw new Error('Word ID is required');
      return getWordGroups(id);
    },
    enabled: !!id,
  });
};
