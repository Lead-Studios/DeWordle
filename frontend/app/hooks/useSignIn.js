import API from '@/utils/axios';
import { useMutation } from '@tanstack/react-query';

const URL = 'auth';

export function useSignin() {
  return useMutation({
    mutationFn: (data) => API.post(`${URL}/sign-in`, data),
    onSuccess: (res) => {
      localStorage.setItem('currentUser', res.data);
    },
    onError: (error) => {
      console.error('Something went wrong', error);
    },
  });
}
