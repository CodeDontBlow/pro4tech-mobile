import * as SecureStore from 'expo-secure-store';
import api from './api';

type RegisterPayload = {
  name: string;
  email: string;
  password: string;
  phone?: string;
  companyId: string;
  role: 'CLIENT' | 'AGENT' | 'ADMIN';
};

type RegisterResponse = {
  id: string;
  name: string;
  email: string;
  role: string;
};

type LoginPayload = {
  email: string;
  password: string;
};

type LoginResponse = {
  access_token: string;
};

export const authService = {
  async register(payload: RegisterPayload): Promise<RegisterResponse> {
    const { data } = await api.post<RegisterResponse>('/user/register', payload);
    return data;
  },

  async login(payload: LoginPayload): Promise<void> {
    const { data } = await api.post<LoginResponse>('/auth/login', payload);
    await SecureStore.setItemAsync('orbita_token', data.access_token);
  },

  async logout(): Promise<void> {
    await SecureStore.deleteItemAsync('orbita_token');
  },

  async getToken(): Promise<string | null> {
    return SecureStore.getItemAsync('orbita_token');
  },
};