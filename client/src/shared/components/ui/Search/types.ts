import type{ ReactNode } from "react";

export interface SearchSuggestion {
  id: string;
  label: string;
  subtitle?: string;
  icon?: ReactNode;
  image?: string;
}

export interface SearchProps {
  value: string;
  onChange: (value: string) => void;

  placeholder?: string;

  onSearch?: () => void;

  suggestions?: SearchSuggestion[];

  onSuggestionSelect?: (
    suggestion: SearchSuggestion
  ) => void;

  loading?: boolean;

  showButton?: boolean;

  buttonLabel?: string;

  icon?: ReactNode;

  onLocationChange?: (latitude: number | null, longitude: number | null) => void;
}