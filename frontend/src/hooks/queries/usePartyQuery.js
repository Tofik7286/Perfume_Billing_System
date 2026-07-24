import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  fetchParties,
  fetchPartyById,
  createParty,
  updateParty,
  deleteParty
} from '@/api/partyApi';

export const usePartiesQuery = (params = {}) => {
  return useQuery({
    queryKey: ['parties', params],
    queryFn: () => fetchParties(params),
  });
};

export const usePartyDetailQuery = (id) => {
  return useQuery({
    queryKey: ['party', id],
    queryFn: () => fetchPartyById(id),
    enabled: Boolean(id),
  });
};

export const useCreatePartyMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createParty,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['parties'] });
    },
  });
};

export const useUpdatePartyMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateParty,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['parties'] });
    },
  });
};

export const useDeletePartyMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteParty,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['parties'] });
    },
  });
};
