import { useQuery } from '@tanstack/react-query';
import { 
  getGroups, 
  getGroup, 
  getGroupWords, 
  getGroupStudySessions, 
  GroupsApiResponse,
  GroupApiResponse,
  GroupWordsApiResponse,
  GroupStudySessionsApiResponse
} from '@/services/groupService';

export const useGroups = (page = 1, pageSize = 20) => {
  return useQuery<GroupsApiResponse, Error>({
    queryKey: ['groups', page, pageSize],
    queryFn: () => getGroups(page, pageSize),
  });
};

export const useGroup = (id: string | number | undefined) => {
  return useQuery<GroupApiResponse, Error>({
    queryKey: ['group', id],
    queryFn: () => {
      if (!id) throw new Error('Group ID is required');
      return getGroup(id);
    },
    enabled: !!id,
  });
};

export const useGroupWords = (id: string | number | undefined, page = 1, pageSize = 100) => {
  return useQuery<GroupWordsApiResponse, Error>({
    queryKey: ['group', id, 'words', page, pageSize],
    queryFn: () => {
      if (!id) throw new Error('Group ID is required');
      return getGroupWords(id, page, pageSize);
    },
    enabled: !!id,
  });
};

export const useGroupStudySessions = (id: string | number | undefined, page = 1, pageSize = 20) => {
  return useQuery<GroupStudySessionsApiResponse, Error>({
    queryKey: ['group', id, 'studySessions', page, pageSize],
    queryFn: () => {
      if (!id) throw new Error('Group ID is required');
      return getGroupStudySessions(id, page, pageSize);
    },
    enabled: !!id,
  });
};
