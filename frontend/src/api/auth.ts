import { api } from './client';

interface LoginResponse {
  success: boolean;
  data: {
    token: string;
    admin: {
      id: string;
      email: string;
      name: string;
      role: string;
    };
  };
}

export const loginAdmin = async (email: string, password: string) => {
  const { data } = await api.post<LoginResponse>('/auth/login', {
    email,
    password,
  });
  return data.data;
};