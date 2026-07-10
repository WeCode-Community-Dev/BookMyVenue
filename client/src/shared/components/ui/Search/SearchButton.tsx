interface SearchButtonProps {
    label? : string;
    onClick: () => void;
}

const SearchButton = ({
    label = 'Search',
    onClick
}: SearchButtonProps) =>{
    return (
        <button 
        onClick={onClick}
        className="bg-[#e21a47] hover:bg-[#c81239] transition-all duration-200 text-white px-6 py-3 rounded-xl flex items-center justify-center gap-2 font-medium text-sm cursor-pointer"
        >
            {label}
        </button>
    )
}

export default SearchButton