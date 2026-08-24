export type SearchCategory =
  | 'STUDENTS'
  | 'FACULTY'
  | 'ACADEMIC'
  | 'FINANCE'
  | 'HOSPITAL'
  | 'PHARMACY'
  | 'HOSTEL'
  | 'LIBRARY'
  | 'TRANSPORT'
  | 'HR'
  | 'QUICK_ACTIONS';

export interface SearchResult {
  id: string;
  title: string;
  subtitle?: string;
  category: SearchCategory;
  url: string;
  badge?: string;
}

export interface QuickAction {
  id: string;
  title: string;
  description: string;
  url: string;
  permission?: string;
  shortcut?: string;
  category: 'ACTIONS' | 'NAVIGATION';
}
