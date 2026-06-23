import api from '../lib/axios';
import type { LoginResponse } from '../types';

export const authService = {
  login: async (rut: string, password: string): Promise<LoginResponse> => {
    const { data } = await api.post<LoginResponse>('/auth/login', { rut, password });
    return data;
  },
  refresh: async (refreshToken: string): Promise<LoginResponse> => {
    const { data } = await api.post<LoginResponse>('/auth/refresh', { refreshToken });
    return data;
  },
  logout: async (refreshToken: string): Promise<void> => {
    await api.post('/auth/logout', { refreshToken });
  },
  register: async (payload: {
    rut: string;
    nombres: string;
    primer_apellido: string;
    segundo_apellido?: string;
    tipo_usuario: string;
    correo_electronico: string;
    password: string;
  }): Promise<{ usuario_id: number; rut: string; correo_electronico: string }> => {
    const { data } = await api.post('/auth/register', payload);
    return data;
  },
};
