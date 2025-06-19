import { create } from 'zustand';
import type { UiState } from '@/lib/types';

// Helper to safely access localStorage
const getInitialTheme = (): UiState['theme'] => {
  if (typeof window !== 'undefined') {
    const storedTheme = localStorage.getItem('theme') as UiState['theme'];
    if (storedTheme && ['light', 'dark', 'system'].includes(storedTheme)) {
      return storedTheme;
    }
  }
  return 'system'; // Default theme
};

export const useUiStore = create<UiState>((set) => ({
  theme: getInitialTheme(),
  setTheme: (theme) => {
    set({ theme });
    if (typeof window !== 'undefined') {
      localStorage.setItem('theme', theme);
      // This logic is usually handled by next-themes ThemeProvider,
      // but can be kept if direct manipulation is ever needed or for non-next-themes parts.
      // For BlockPay, ThemeProvider handles DOM class updates.
    }
  },
  // sidebarOpen and toggleSidebar are retained for type consistency from the original PRD,
  // even if the visual sidebar component is not used in the current layout.
  // They could be repurposed or removed if truly no longer relevant.
  sidebarOpen: typeof window !== 'undefined' ? localStorage.getItem('sidebarOpen') === 'true' : true,
  toggleSidebar: () => set((state) => {
    const newSidebarOpen = !state.sidebarOpen;
    if (typeof window !== 'undefined') {
      localStorage.setItem('sidebarOpen', String(newSidebarOpen));
    }
    return { sidebarOpen: newSidebarOpen };
  }),
}));
