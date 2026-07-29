import type { SearchSuggestion } from "./types";

interface SuggestionItemProps {
    suggestion: SearchSuggestion;
    onClick: (suggestion: SearchSuggestion) => void;
}

const SuggestionItem = ({
    suggestion,
    onClick
}:SuggestionItemProps) => {
    return (
         <button
      onClick={()=>onClick(suggestion)}
      className="
        w-full
        flex
        flex-col
        text-left
        px-4
        py-3
        hover:bg-zinc-800
        transition
      "
    >

      <span className="text-white text-sm">
        {suggestion.label}
      </span>

      {
        suggestion.subtitle &&
        <span className="text-zinc-500 text-xs">
          {suggestion.subtitle}
        </span>
      }

    </button>
    )
}

export default SuggestionItem;