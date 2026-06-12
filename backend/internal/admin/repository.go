package admin

import (
	"context"

	"github.com/WeCode-Community-Dev/BookMyVenue/db/sqlc"
	"github.com/WeCode-Community-Dev/BookMyVenue/pkg/utils"
	"github.com/jackc/pgx/v5/pgtype"
)

type repository struct {
	db *sqlc.Queries
}

func newRepository(db *sqlc.Queries) *repository {
	return &repository{db: db}
}

func (r *repository) getAllPendingVenues(ctx context.Context) ([]sqlc.Venue, error) {
	return r.db.GetAllPendingVenues(ctx)
}

func (r *repository) getAmenitiesForVenue(ctx context.Context, venueID pgtype.UUID) ([]sqlc.Amenity, error) {
	return r.db.GetAmenitiesForVenue(ctx, venueID)
}

func (r *repository) getVenueImagesByVenueID(ctx context.Context, venueID pgtype.UUID) ([]sqlc.VenueImage, error) {
	return r.db.GetVenueImages(ctx, venueID)
}

func (r *repository) getVenueByVenueID(ctx context.Context, venueID string) (sqlc.Venue, error) {
	venueUUID, err := utils.StringToUUID(venueID)
	if err != nil {
		return sqlc.Venue{}, nil
	}
	return r.db.GetVenueByID(ctx, venueUUID)
}

func (r *repository) approveVenue(ctx context.Context, venueID pgtype.UUID) error {
	return r.db.ApproveVenue(ctx, venueID)
}

func (r *repository) rejectVenue(ctx context.Context, venueID pgtype.UUID) error {
	return r.db.RejectVenue(ctx, venueID)
}

// Get all approved Venues
func (r *repository) getAllApprovedVenues(ctx context.Context) ([]sqlc.Venue, error) {
	return r.db.GetAllVenues(ctx)
}
