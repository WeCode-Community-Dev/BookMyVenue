const VenueGallery = ({ images = [] }) => {

    return (
 
       <div className="grid grid-cols-2 gap-4">
 
          {images.map((image) => (
 
             <img
                key={image}
                src={image}
                alt=""
                className="
                   rounded-xl
                   h-48
                   w-full
                   object-cover
                "
             />
 
          ))}
 
       </div>
 
    );
 
 };
 
 export default VenueGallery;