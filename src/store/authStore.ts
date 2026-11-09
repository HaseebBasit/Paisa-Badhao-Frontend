import { create } from 'zustand';
import { api } from '@/utils/api';
import { User, Wallet } from '@/types';

interface AuthState {
  user: User | null;
  wallet: Wallet | null;
  token: string | null;
  isLoading: boolean;
  error: string | null;
  login: (credentials: { email: string; password: string }) => Promise<void>;
  register: (data: { name: string; email: string; password: string }) => Promise<void>;
  logout: () => void;
  loadSession: () => Promise<void>;
  updateWalletBalance: (newBalance: number) => void;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  wallet: null,
  token: typeof window !== 'undefined' ? localStorage.getItem('pb_token') : null,
  isLoading: false,
  error: null,

  login: async ({ email, password }) => {
    set({ isLoading: true, error: null });
    try {
      const response: any = await api.post('/auth/login', { email, password });
      const { user, wallet, token } = response.data;

      localStorage.setItem('pb_token', token);
      localStorage.setItem('pb_user', JSON.stringify(user));

      set({
        user,
        wallet,
        token,
        isLoading: false,
        error: null,
      });
    } catch (err: any) {
      set({ error: err.message, isLoading: false });
      throw err;
    }
  },

  register: async ({ name, email, password }) => {
    set({ isLoading: true, error: null });
    try {
      const response: any = await api.post('/auth/register', { name, email, password });
      const { user, wallet, token } = response.data;

      localStorage.setItem('pb_token', token);
      localStorage.setItem('pb_user', JSON.stringify(user));

      set({
        user,
        wallet,
        token,
        isLoading: false,
        error: null,
      });
    } catch (err: any) {
      set({ error: err.message, isLoading: false });
      throw err;
    }
  },

  logout: () => {
    localStorage.removeItem('pb_token');
    localStorage.removeItem('pb_user');
    set({ user: null, wallet: null, token: null, error: null });
  },

  loadSession: async () => {
    const token = localStorage.getItem('pb_token');
    if (!token) return;

    set({ isLoading: true });
    try {
      const response: any = await api.get('/auth/me');
      set({
        user: response.data.user,
        wallet: response.data.wallet,
        isLoading: false,
      });
    } catch (err) {
      localStorage.removeItem('pb_token');
      localStorage.removeItem('pb_user');
      set({ user: null, wallet: null, token: null, isLoading: false });
    }
  },

  updateWalletBalance: (newBalance: number) => {
    set((state) => ({
      wallet: state.wallet ? { ...state.wallet, balance: newBalance } : { balance: newBalance, currency: 'TROIX' },
    }));
  },
}));
