import api, { storage } from './api';

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

type User = {
  id: string;
  name: string;
  email: string;
  role: 'CLIENT' | 'AGENT' | 'ADMIN';
};
  
async function getName(): Promise<User> {
  const { data } = await api.get<User>('/user/me');
  return data;    
}


export const authService = {
  async register(payload: RegisterPayload): Promise<RegisterResponse> {
    const { data } = await api.post<RegisterResponse>('/user', payload);
    return data;
  },

  async login(payload: LoginPayload): Promise<User> {
  const { data } = await api.post<LoginResponse>('/auth/login', payload);

  await storage.setItem('orbita_token', data.access_token);

  const user = await getName();

  return user;
  },

  async logout(): Promise<void> {
    await storage.deleteItem('orbita_token');
  },

  async getToken(): Promise<string | null> {
    return storage.getItem('orbita_token');
  },

  getName,
 

};