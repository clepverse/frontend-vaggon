import { createContext, ReactNode, useEffect, useState } from 'react';
import { api } from '../services/api';
import { useNavigate } from 'react-router-dom';

import Cookies from 'universal-cookie';
import { toast } from 'react-toastify';

type User = {
  id: number;
  login: string;
  activities: Activity[];
};

type Activity = {
  id: number;
  name: string;
  description: string;
  start_date_and_time: string;
  end_date_and_time: string;
  status: Status;
  user_id: number;
};

enum Status {
  PEDANT,
  COMPLETED,
  CANCELED,
}

type AuthProviderProps = {
  children: ReactNode;
};

type SignInCredentials = {
  login: string;
  password: string;
};

type AuthContextData = {
  signIn(credentials: SignInCredentials): Promise<void>;
  user: User;
  isAuthenticated: boolean;
};

export const AuthContext = createContext({} as AuthContextData);
const cookies = new Cookies();

export function signOut() {
  cookies.remove('agenda.token');
  cookies.remove('user.id');

  localStorage.clear();

  const navigate = useNavigate();
  navigate('/');
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User>(null);
  const isAuthenticated = !!user;

  const cookies = new Cookies();

  useEffect(() => {
    const id = cookies.get('user.id', {
      doNotParse: false,
    });

    const { 'agenda.token': token } = cookies.getAll();

    if (token) {
      api
        .get(`/me/${id}`)
        .then((response) => {
          const { id, login, activities } = response.data;

          localStorage.setItem('userId', id);

          setUser({
            id,
            login,
            activities,
          });
        })
        .catch(() => {
          signOut();
        });
    }
  }, []);

  const navigate = useNavigate();

  async function signIn({ login, password }: SignInCredentials) {
    try {
      const response = await api.post('sessions', {
        login,
        password,
      });

      const { id, activities } = response.data.user;
      const { token } = response.data;

      cookies.set('user.id', id, {
        maxAge: 60 * 60 * 24,
        path: '/',
      });

      cookies.set('agenda.token', token, {
        maxAge: 60 * 60 * 24 * 30,
        path: '/',
      });

      setUser({
        id,
        login,
        activities,
      });

      api.defaults.headers['Authorization'] = `Bearer ${token}`;

      toast.success('Successfully connected.');

      navigate('/activities');
    } catch (err) {
      console.log(err);
      toast.error('E-mail or password incorrect.');
    }
  }

  return (
    <AuthContext.Provider value={{ signIn, user, isAuthenticated }}>
      {children}
    </AuthContext.Provider>
  );
}
