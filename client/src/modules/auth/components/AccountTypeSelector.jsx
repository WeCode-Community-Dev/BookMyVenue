const AccountTypeSelector = ({ onSelect }) => {

    return (
 
       <div className="mt-8 space-y-4">
 
          <button
             onClick={() => onSelect('USER')}
             className="
                w-full
                p-5
                border
                rounded-xl
                text-left
                hover:border-red-500
             "
          >
             <h3 className="font-semibold">
                Book Venues
             </h3>
 
             <p className="text-sm text-gray-500">
                Find and book venues for events
             </p>
          </button>
 
          <button
             onClick={() => onSelect('OWNER')}
             className="
                w-full
                p-5
                border
                rounded-xl
                text-left
                hover:border-red-500
             "
          >
             <h3 className="font-semibold">
                List My Venue
             </h3>
 
             <p className="text-sm text-gray-500">
                Register and manage your venue
             </p>
          </button>
 
       </div>
 
    );
 
 };
 
 export default AccountTypeSelector;