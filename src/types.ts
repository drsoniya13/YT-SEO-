/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type Page = 'Dashboard' | 'Content Architect' | 'Vocal Pro' | 'Vision Forge' | 'Signal Sync' | 'History' | 'API Keys' | 'Settings';

export interface AppState {
  currentPage: Page;
  theme: 'dark' | 'light' | 'sci-fi';
  isSidebarOpen: boolean;
}

export const NAV_ITEMS = [
  { id: 'Dashboard', icon: 'LayoutDashboard', label: 'Dashboard' },
  { id: 'Content Architect', icon: 'Sparkles', label: 'Content Architect' },
  { id: 'Vocal Pro', icon: 'Mic', label: 'Vocal Pro' },
  { id: 'Vision Forge', icon: 'Image', label: 'Vision Forge' },
  { id: 'Signal Sync', icon: 'Activity', label: 'Signal Sync' },
  { id: 'History', icon: 'History', label: 'History' },
  { id: 'API Keys', icon: 'KeyRound', label: 'API Keys' },
  { id: 'Settings', icon: 'Settings', label: 'Settings' },
] as const;
