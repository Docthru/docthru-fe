import { useModal } from '@/hooks/useModal';
import { createLogin, createUser, getUserMe } from '@/service/api/auth';
import { useMutation, useQueryClient, useQuery } from '@tanstack/react-query';
import { createContext, useEffect, useState } from 'react';

export const AuthContext = createContext({
  user: null,
  isLoading: false,
  login: () => {},
  signUp: () => {},
  isModalOpen: false,
});

export function AuthProvider({ children }) {
  const queryClient = useQueryClient();
  const [accessToken, setAccessToken] = useState(null);
  const { onModalOpen, Modal: AuthModal, isModalOpen } = useModal();
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('accessToken');

      if (token) {
        setAccessToken(localStorage.getItem('accessToken'));
      }
    }
  }, []);

  const {
    data,
    isLoading: isUserLoading,
    refetch: getMe,
  } = useQuery({
    queryKey: ['user'],
    queryFn: getUserMe,
    staleTime: Infinity,
    cacheTime: Infinity,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    enabled: !!accessToken,
  });

  useEffect(() => {
    setIsLoading(isUserLoading);
  }, [isUserLoading]);

  const loginMutation = useMutation({
    onMutate: () => setIsLoading(true),
    mutationFn: (data) => createLogin(data),
    onSuccess: (data) => {
      if (data && data.accessToken) {
        const { accessToken } = data;
        localStorage.setItem('accessToken', accessToken);
        queryClient.invalidateQueries({ queryKey: ['user'] });
        getMe();
        console.log('Access Token:', data.accessToken);
      }
    },
    onSettled: () => setIsLoading(false),
  });

  const signUpMutation = useMutation({
    onMutate: () => setIsLoading(true),
    mutationFn: (data) => createUser(data),
    onSuccess: (data) => {
      console.log('Success:', data);
      if (data && data.accessToken) {
        const { accessToken } = data;
        localStorage.setItem('accessToken', accessToken);
        queryClient.invalidateQueries({ queryKey: ['user'] });

        getMe();
        console.log('Access Token:', data.accessToken);
      }
    },
    onSettled: () => setIsLoading(false),
  });

  return (
    <AuthContext.Provider
      value={{
        user: data,
        isLoading,
        login: loginMutation,
        signUp: signUpMutation,
        isModalOpen,
      }}
    >
      {children}
      <AuthModal />
    </AuthContext.Provider>
  );
}
