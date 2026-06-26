package availability

import (
	"context"
	"database/sql"
	"errors"
	"log"
	"strings"

	"github.com/WeCode-Community-Dev/BookMyVenue/db/sqlc"
	"github.com/WeCode-Community-Dev/BookMyVenue/pkg/utils"
)

type service struct {
	repo *repository
}

func newService(db *sqlc.Queries) *service {
	return &service{repo: newRepository(db)}
}

func (s *service) availableSlots(ctx context.Context, venueID string) (*[]sqlc.Availability, error) {
	venue, err := s.repo.getVenueByID(ctx, venueID)
	if err != nil {
		if err == sql.ErrNoRows {
			return nil, errors.New("venue not found!")
		}
		return nil, errors.New("Connot get venue for availability: " + err.Error())
	}

	slots, err := s.repo.getAvailableSlotsByVenueID(ctx, venue.ID)
	if err != nil {
		return nil, errors.New("cannot get slots: " + err.Error())
	}

	return &slots, nil
}

func (s *service) setNewSlot(ctx context.Context, req createSlot, venueID, ownerID string) ([]sqlc.Availability, error) {
	venue, err := s.repo.getVenueByID(ctx, venueID)
	if err != nil {
		if err == sql.ErrNoRows {
			return []sqlc.Availability{}, errors.New("Venue not found: " + err.Error())
		}
		return []sqlc.Availability{}, errors.New("cannot get venue: " + err.Error())
	}

	if venue.OwnerID.String() != ownerID {
		return []sqlc.Availability{}, errors.New("Unautherized: you can't add slots!.")
	}
	var slots []sqlc.Availability
	for _, RSlot := range req.Slots {

		startTime, err := utils.StringToTimeStamp(RSlot.Date + " " + RSlot.StartTime)
		if err != nil {
			return []sqlc.Availability{}, err
		}
		endTime, err := utils.StringToTimeStamp(RSlot.Date + " " + RSlot.EndTime)
		if err != nil {
			return []sqlc.Availability{}, err
		}

		slot, err := s.repo.createNewSlot(ctx, sqlc.CreateNewSlotParams{
			VenueID:   venue.ID,
			StartTime: startTime,
			EndTime:   endTime,
		})

		slots = append(slots, slot)
	}
	return slots, nil
}

func (s *service) deleteSlot(ctx context.Context, slot_id string) error {
	return s.repo.deleteSlot(ctx, slot_id)
}

func (s *service) getSlotByID(ctx context.Context, slotID string) (*slotResponseForBooking, error) {
	slot, err := s.repo.getAvailableSlotsByID(ctx, slotID)
	if err != nil {
		if err == sql.ErrNoRows {
			return nil, errors.New("Slot not found!")
		}
		return nil, err
	}

	venue, err := s.repo.getVenueByID(ctx, slot.VenueID.String())
	if err != nil {
		if err == sql.ErrNoRows {
			return nil, errors.New("Venue not found")
		}
		return nil, err
	}
	log.Println(slot.EndTime)
	date, endTime, exists := strings.Cut(slot.EndTime.Time.String(), " ")
	if !exists {
		date = slot.EndTime.Time.GoString()
	}

	_, start_time, _ := strings.Cut(slot.StartTime.Time.String(), " ")
	slotRes := &slotResponseForBooking{
		Name: venue.Name,
		Date: date,
		Time: start_time + " - " + endTime,
	}

	return slotRes, nil
}
