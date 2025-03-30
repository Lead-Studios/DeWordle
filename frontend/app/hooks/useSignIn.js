import { AppContext } from '@/context/AppContext';
import API from '@/utils/axios';
import { useMutation } from '@tanstack/react-query';
import { useContext } from 'react';
import { toast } from "react-toastify";
import Cookies from 'js-cookie';

const URL = 'auth';

const hours = 6;

export function useSignin() {

  return useMutation({
    mutationFn: (data) => API.post(`${URL}/sign-in`, data),
    onSuccess: (res) => {
      const userData = res.data[1];
      const tokens = res.data[0]
      const accessToken = tokens.access_token;
      const refreshToken = tokens.refresh_token;
      Cookies.set('accessToken', accessToken, { expires: hours / 24 });
      Cookies.set('refreshToken', refreshToken, { expires: 7 });
      localStorage.setItem('authToken', res.data[0].token);
      localStorage.setItem('currentUser', JSON.stringify(userData));
      if (localStorage.getItem("isFirstTime") === "true" || localStorage.getItem("isFirstTime") == "false") {
        localStorage.setItem("isFirstTime", false);
      }
      else {
        localStorage.setItem("isFirstTime", true);
      }
      toast.success("Sign In Successfully");
    },
    onError: (error) => {
      console.error('Something went wrong', error);
      toast.error(error?.response?.data?.message);
    },
  });
}
