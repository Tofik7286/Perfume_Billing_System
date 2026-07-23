import { useMutation, useQuery } from '@tanstack/react-query';
import { loginUser, getMe } from '@/api/authApi';
import useAuthStore from '@/store/useAuthStore';

export const useLoginMutation = () => {
  const setAuth = useAuthStore((state) => state.setAuth);

  return useMutation({
    mutationFn: loginUser,
    onSuccess: (data) => {
      setAuth({
        access: data.access,
        refresh: data.refresh,
        user: data.user,
      });
    },
  });
};

export const useProfileQuery = () => {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const setUser = useAuthStore((state) => state.setUser);

  return useQuery({
    queryKey: ['authUserProfile'],
    queryFn: getMe,
    enabled: isAuthenticated,
    onSuccess: (data) => {
      if (data) {
        setUser(data);
      }
    },
  });
};
