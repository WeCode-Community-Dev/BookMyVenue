import type{ ReactNode } from "react";

export interface SearchSuggestion {
  id: string;
  label: string;
  subtitle?: string;
  icon?: ReactNode;
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
}