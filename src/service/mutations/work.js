import { useMutation, useQueryClient } from '@tanstack/react-query';
import {
  createWork,
  createWorkFeedback,
  createWorkLike,
  deleteWork,
  deleteWorkUnlike,
  updateWork,
} from '../api/work';
import { challengeKey, workKey } from '@/variables/queryKeys';
import { useRouter } from 'next/router';

export function useCreateFeedback(id) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data) => createWorkFeedback(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: workKey.feedbacks(id),
      });
    },
  });
}

export function useMutateLikes(id) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ isLiked }) => {
      return isLiked ? deleteWorkUnlike(id) : createWorkLike(id);
    },
    onMutate: async ({ isLiked }) => {
      await queryClient.cancelQueries(workKey.detail(id));

      const prevData = queryClient.getQueryData(workKey.detail(id));

      if (prevData) {
        queryClient.setQueryData(workKey.detail(id), (prev) => {
          return {
            ...prev,
            isLike: !isLiked,
            likeCount: isLiked ? prev.likeCount - 1 : prev.likeCount + 1,
          };
        });
        return { prevData };
      }
    },
    onError: (context) => {
      queryClient.setQueryData(workKey.detail(id), context.prevData);
    },
    onSettled: () => {
      queryClient.invalidateQueries(workKey.detail(id));
    },
  });
}

export function useCreateWork() {
  const queryClient = useQueryClient();
  const router = useRouter();

  return useMutation({
    mutationFn: ({ id, data }) => createWork(id, data),
    onSuccess: async (data, variables) => {
      await queryClient.invalidateQueries({
        queryKey: challengeKey.list(variables.id),
      });
      await queryClient.refetchQueries(workKey.list(variables.id));
      router.push(`/work/${data.id}`);
    },
  });
}

export function useDeleteWork() {
  const queryClient = useQueryClient();
  const router = useRouter();

  return useMutation({
    mutationFn: ({ id }) => deleteWork(id),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: workKey.detail(variables.id),
      });
      router.push(`/me`);
    },
  });
}

export function useUpdateWork() {
  const queryClient = useQueryClient();
  const router = useRouter();

  return useMutation({
    mutationFn: ({ id, data }) => updateWork(id, data),
    onSuccess: async (data, variables) => {
      await queryClient.invalidateQueries({
        queryKey: challengeKey.list(variables.id),
      });
      await queryClient.refetchQueries(workKey.detail(variables.id));
      router.push(`/work/${data.id}`);
    },
  });
}
