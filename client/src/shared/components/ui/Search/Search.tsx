import SearchInput from "./SearchInput";
import SearchButton from "./SearchButton";
import type { SearchProps } from "./types";
import SearchSuggestions from "./SearchSuggestions";

const Search = ({
    value,
    onChange,
    placeholder,
    onSearch,
    showButton=true,
    buttonLabel='Search',
    icon,
    suggestions,
    onSuggestionSelect
}: SearchProps)=> {
    return (
<div className="relative max-w-3xl">

 <div className="
    mt-10
    bg-zinc-900/80
    backdrop-blur-md
    border
    border-zinc-800/60
    rounded-2xl
    p-3
    flex
    flex-col
    md:flex-row
    gap-3
    shadow-xl
 ">

    <SearchInput
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      icon={icon}
    />

    {
      showButton &&
      <SearchButton
        label={buttonLabel}
        onClick={()=>onSearch?.()}
      />
    }

 </div>


 {
   suggestions &&
   suggestions.length > 0 &&
   <SearchSuggestions
      suggestions={suggestions}
      onSelect={(item)=>onSuggestionSelect?.(item)}
   />
 }

</div>
)
}

export default Search;