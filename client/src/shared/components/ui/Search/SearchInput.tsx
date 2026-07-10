import type {ReactNode} from 'react';

interface SearchInputProps {
    value: string;
    onChange: (value: string) => void;
    placeholder?: string;
    icon?: ReactNode;
}

const SearchInput = ({
    value,
    onChange,
    placeholder,
    icon,
} : SearchInputProps ) => {

    return (
        <div className="flex items-center gap-3 px-4 py-3 bg-zinc-950/40 rounded-xl border border-zinc-800/40 focus-within:border-zinc-700/60 flex-1 transition-all">
            <input type="text"
            value={value}
            onChange={ (e) => onChange(e.target.value)}
            placeholder={placeholder}
            className='w-full bg-transparent outline-none border-none text-white placeholder-zinc-500 text-sm focus:ring-0'
            />
            {icon}
        </div>
    )
}

export default SearchInput;