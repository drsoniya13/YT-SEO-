/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type Page = 'Dashboard' | 'Vocal Synthesis' | 'Frequency Extractor' | 'Script Forge' | 'Lens Alchemy' | 'History' | 'API Keys' | 'Settings';

export interface AppState {
  currentPage: Page;
  theme: 'dark' | 'light' | 'sci-fi';
  isSidebarOpen: boolean;
}

export const NAV_ITEMS = [
  { id: 'Dashboard', icon: 'LayoutDashboard', label: 'Dashboard' },
  { id: 'Vocal Synthesis', icon: 'Mic', label: 'Vocal Synthesis' },
  { id: 'Frequency Extractor', icon: 'Activity', label: 'Frequency Extractor' },
  { id: 'Script Forge', icon: 'FileText', label: 'Script Forge' },
  { id: 'Lens Alchemy', icon: 'Image', label: 'Lens Alchemy' },
  { id: 'History', icon: 'History', label: 'History' },
  { id: 'API Keys', icon: 'KeyRound', label: 'API Keys' },
  { id: 'Settings', icon: 'Settings', label: 'Settings' },
] as const;
