'use client';

import { useContext } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { AuthContext } from '@/context/AuthProvider';
import { createLogout } from '@/service/api/auth';
import { useRouter } from 'next/router';

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error('Error: not used within AuthProvider');
  }
  return context;
}

export function useLogout() {
  const queryClient = useQueryClient();
  const router = useRouter();

  const { mutateAsync } = useMutation({
    mutationFn: createLogout,
    onSuccess: () => {
      queryClient.setQueriesData(['user'], null);
      localStorage.removeItem('accessToken');
      router.reload();
    },
  });

  return mutateAsync;
}
