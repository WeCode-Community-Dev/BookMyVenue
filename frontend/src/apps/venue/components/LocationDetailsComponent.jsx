import React, {useState} from 'react'

const LocationDetailsComponent = ({formData, setFormData}) => {
    const [location, setLocations] = useState([]);



  return (
    <div>

         <motion.section
            variants={cardVariants}
            className="rounded-2xl border border-border/60 bg-white/70 backdrop-blur-sm p-6 shadow-sm hover:shadow-md transition-shadow"
          >
            <div className="flex items-center gap-3 border-b border-border/40 pb-4 mb-6">
              <div className="p-2 rounded-xl bg-primary/10 text-primary">
                <MapPin size={20} />
              </div>
              <div>
                <h2 className="font-semibold text-lg text-foreground">
                  Location Information
                </h2>
                <p className="text-xs text-muted-foreground">
                  Help clients navigate to your venue location.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* City/Region */}
              <div>
                <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground/90 mb-2 block">
                  City / Location <span className="text-accent font-bold">*</span>
                </label>
                <input
                  list="locations"
                  className="input"
                  placeholder="Search city/location..."
                  value={formData.location}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      location: e.target.value,
                    })
                  }
                />
                <datalist id="locations">
                  {locations.map((item) => (
                    <option key={item} value={item} />
                  ))}
                </datalist>
              </div>

              {/* Full Address */}
              <div>
                <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground/90 mb-2 block">
                  Full Address <span className="text-accent font-bold">*</span>
                </label>
                <input
                  type="text"
                  placeholder="e.g., 5th Avenue, Palace Road"
                  className="input"
                  value={formData.address}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      address: e.target.value,
                    })
                  }
                />
              </div>
            </div>
          </motion.section>
      
    </div>
  )
}

export default LocationDetailsComponent
