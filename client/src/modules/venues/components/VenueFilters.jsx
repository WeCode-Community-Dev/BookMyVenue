const VenueFilters = ({
    search,
    setSearch
 }) => {
 
    return (
 
       <div className="flex gap-4">
 
          <input
             placeholder="City"
             value={search.city}
             onChange={(e) =>
                setSearch({
                   ...search,
                   city: e.target.value
                })
             }
          />
 
          <select
             value={search.type}
             onChange={(e) =>
                setSearch({
                   ...search,
                   type: e.target.value
                })
             }
          >
 
             <option value="">
                All Types
             </option>
 
             <option value="AUDITORIUM">
                Auditorium
             </option>
 
          </select>
 
       </div>
 
    );
 
 };
 
 export default VenueFilters;