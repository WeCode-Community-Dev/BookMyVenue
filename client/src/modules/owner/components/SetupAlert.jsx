const SetupAlert = ({
    incompleteVenues,
    onComplete
 }) => {
 
    if (!incompleteVenues.length) {
       return null;
    }
 
    return (
       <div
          className="
             mb-8
             border
             border-yellow-300
             bg-yellow-50
             rounded-2xl
             p-5
          "
       >
 
          <h3 className="font-semibold">
 
             Venue setup required
 
          </h3>
 
          <p className="text-gray-600 mt-1">
 
             {incompleteVenues.length}
             {" "}
             venue(s) require additional information.
 
          </p>
 
          <button
             onClick={() =>
                onComplete(incompleteVenues[0])
             }
             className="btn-primary mt-4"
          >
             Complete Setup
          </button>
 
       </div>
    );
 };
 
 export default SetupAlert;