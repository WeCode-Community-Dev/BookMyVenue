import type { SearchSuggestion } from "./types";
import SuggestionItem from "./SuggestionItem";

interface SearchSuggestionsProps {
  suggestions: SearchSuggestion[];
  onSelect: (suggestion: SearchSuggestion) => void;
}

const SearchSuggestions = ({
  suggestions,
  onSelect,
}: SearchSuggestionsProps) => {

  if (!suggestions.length) {
    return null;
  }

  return (
    <div className="
      absolute 
      top-full 
      left-0 
      right-0 
      mt-2
      bg-zinc-900
      border
      border-zinc-800
      rounded-xl
      overflow-hidden
      shadow-xl
      z-50
    ">
      {
        suggestions.map((suggestion)=>(
          <SuggestionItem
            key={suggestion.id}
            suggestion={suggestion}
            onClick={onSelect}
          />
        ))
      }
    </div>
  );
};

export default SearchSuggestions;