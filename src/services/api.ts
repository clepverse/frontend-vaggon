import axios, { AxiosError } from 'axios';
import Cookies from 'universal-cookie';
import { signOut } from '../contexts/AuthContext';

const cookies = new Cookies();
const sendCookies = cookies.getAll();

export const api = axios.create({
  baseURL: 'http://localhost:3333/',
  headers: {
    Authorization: `Bearer ${sendCookies['agenda.token']}`,
  },
});

// api.interceptors.response.use(
//   (response) => {
//     return response;
//   },
//   (error: AxiosError) => {
//     if (error.response.status === 401) {
//     } else {
//       signOut();
//     }

//     return Promise.reject(error);
//   },
// );
