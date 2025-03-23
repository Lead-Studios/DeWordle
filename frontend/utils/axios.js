import axios from "axios";
/* import { getSession } from 'next-auth/react'; */

const API = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  timeout: 15000,
});

/* API.interceptors.request.use(async (req) => {
  const session = await getSession();
  if (session?.accessToken) {
    req.headers.Authorization = `Bearer ${session.accessToken}`;
  }
  return req;
});
 */
export default API;
