import { Search } from 'lucide-react';
import { useState } from 'react';

import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';

export function VenueSearch({ initialCity = '', onSearch, isLoading }) {
  const [city, setCity] = useState(initialCity);

  function handleSubmit(event) {
    event.preventDefault();
    onSearch(city.trim());
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-col gap-3 rounded-card border border-brand-border bg-white p-4 shadow-sm sm:flex-row sm:items-center"
    >
      <div className="relative flex-1">
        <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-brand-muted" />
        <Input
          value={city}
          onChange={(event) => setCity(event.target.value)}
          placeholder="Search by city (e.g. Mumbai)"
          className="pl-9"
          aria-label="Search venues by city"
        />
      </div>
      <div className="flex gap-2">
        <Button type="submit" disabled={isLoading}>
          Search
        </Button>
        <Button
          type="button"
          variant="outline"
          disabled={isLoading || !city}
          onClick={() => {
            setCity('');
            onSearch('');
          }}
        >
          Clear
        </Button>
      </div>
    </form>
  );
}
