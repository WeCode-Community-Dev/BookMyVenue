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

func (r *repository) getVenueAmenitiesByVenueIDs(ctx context.Context, venueIDs []pgtype.UUID) ([]sqlc.GetVenueAmenitiesByVenueIDsRow, error) {
	return r.db.GetVenueAmenitiesByVenueIDs(ctx, venueIDs)
}

func (r *repository) getVenueImagesByVenueIDs(ctx context.Context, imageIDs []pgtype.UUID) ([]sqlc.VenueImage, error) {
	return r.db.GetVenueImagesByVenueIDs(ctx, imageIDs)
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

func (r *repository) getAllRejectedVenues(ctx context.Context) ([]sqlc.Venue, error) {
	return r.db.GetAllRejectedVenues(ctx)
}
