package venues

import (
	"context"

	"github.com/WeCode-Community-Dev/BookMyVenue/db/sqlc"
	"github.com/WeCode-Community-Dev/BookMyVenue/pkg/utils"
	"github.com/jackc/pgx/v5/pgtype"
)

// repository provides database access methods for venue-related operations.
type repository struct {
	db *sqlc.Queries
}

// newRepository creates and returns a new repository instance.
func newRepository(db *sqlc.Queries) *repository {
	return &repository{db: db}
}

// Inserts a new venue into the database.
func (r *repository) createVenue(c context.Context, params sqlc.CreateVenueParams) (sqlc.Venue, error) {
	return r.db.CreateVenue(c, params)
}

// getVenueByID retrieves a venue by its string ID.
// The ID is converted to a UUID before querying the database.
func (r *repository) getVenueByID(ctx context.Context, id string) (sqlc.Venue, error) {
	uuid, err := utils.StringToUUID(id)
	if err != nil {
		return sqlc.Venue{}, err
	}
	return r.db.GetVenueByID(ctx, uuid)
}

func (r *repository) addVenueImage(ctx context.Context, params sqlc.AddVenueImageParams) (sqlc.VenueImage, error) {
	return r.db.AddVenueImage(ctx, params)
}

func (r *repository) createAmenity(ctx context.Context, amenity string) (sqlc.Amenity, error) {
	return r.db.CreateAmenity(ctx, amenity)
}

// links an existing amenity to a venue.
func (r *repository) assignAmenityToVenue(ctx context.Context, params sqlc.AssignAmenityToVenueParams) error {
	return r.db.AssignAmenityToVenue(ctx, params)
}

func (r *repository) getRejectedVenuesByOwnerID(ctx context.Context, ownerID string) ([]sqlc.Venue, error) {
	UUID, err := utils.StringToUUID(ownerID)
	if err != nil {
		return []sqlc.Venue{}, err
	}
	return r.db.GetRejectedVenuesByOwnerID(ctx, UUID)
}

func (r *repository) getAmenitiesForVenue(ctx context.Context, venueID pgtype.UUID) ([]sqlc.Amenity, error) {
	return r.db.GetAmenitiesForVenue(ctx, venueID)
}

func (r *repository) getVenueImagesByVenueID(ctx context.Context, venuID pgtype.UUID) ([]sqlc.VenueImage, error) {
	return r.db.GetVenueImages(ctx, venuID)
}

func (r *repository) getPendingVenuesByOwnerID(ctx context.Context, ownerID string) ([]sqlc.Venue, error) {
	UUID, err := utils.StringToUUID(ownerID)
	if err != nil {
		return []sqlc.Venue{}, err
	}
	return r.db.GetPendingVenuesByOwnerID(ctx, UUID)
}
