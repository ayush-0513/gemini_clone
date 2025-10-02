import { create } from 'zustand'



type AuthState = {
user: { phone: string; country?: string } | null;
login: (user: { phone: string; country?: string }) => void;
logout: () => void;
}


export const useAuthStore = create<AuthState>((set) => ({
user: typeof window !== 'undefined' ? JSON.parse(localStorage.getItem('user') || 'null') : null,
login: (user) => {
set({ user });
localStorage.setItem('user', JSON.stringify(user));
},
logout: () => {
set({ user: null });
localStorage.removeItem('user');
}
}));