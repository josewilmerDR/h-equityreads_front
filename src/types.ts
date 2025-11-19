export type ReaderTheme = 'light' | 'sepia' | 'dark';

export interface PaginationProps {
  content: string;
  chapterTitle?: string;
  containerWidth: number;
  containerHeight: number;
  fontSize: number;
  lineHeight: number;
}

export interface ReaderProps {
  title: string;
  chapterTitle?: string;
  content?: string;
  contentHtml?: string;
  author?: string;
  initialLocation?: number;
  onRequestNextChapter?: () => void;
  onRequestPrevChapter?: () => void;
  hasNextChapter?: boolean;
  hasPrevChapter?: boolean;
  onLocationChange?: (location: number) => void;
}