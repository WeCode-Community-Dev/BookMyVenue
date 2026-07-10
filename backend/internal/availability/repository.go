package availability

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

func (r *repository) getVenueByID(ctx context.Context, venueID string) (sqlc.Venue, error) {
	venueUUID, err := utils.StringToUUID(venueID)
	if err != nil {
		return sqlc.Venue{}, err
	}
	return r.db.GetVenueByID(ctx, venueUUID)
}

func (r *repository) getAvailableSlotsByVenueID(ctx context.Context, venueID pgtype.UUID) ([]sqlc.Availability, error) {
	return r.db.GetAvailableSlotsByVenueID(ctx, venueID)
}

func (r *repository) createNewSlot(ctx context.Context, params sqlc.CreateNewSlotParams) (sqlc.Availability, error) {
	return r.db.CreateNewSlot(ctx, params)
}

func (r *repository) deleteSlot(ctx context.Context, slotID string) error {
	slotUUID, err := utils.StringToUUID(slotID)
	if err != nil {
		return err
	}

	err = r.db.DeleteSlot(ctx, slotUUID)
	return err
}

func (r *repository) getAvailableSlotsByID(ctx context.Context, slotID string) (sqlc.Availability, error) {
	slotUUId, err := utils.StringToUUID(slotID)
	if err != nil {
		return sqlc.Availability{}, err
	}

	return r.db.GetSlotByID(ctx, slotUUId)
}
