package users

import (
	"context"
	"database/sql"
	"errors"
	"fmt"
	"log"
	"strings"

	"github.com/WeCode-Community-Dev/BookMyVenue/db/sqlc"
	"github.com/WeCode-Community-Dev/BookMyVenue/pkg/utils"
	"github.com/jackc/pgx/v5/pgtype"
)

type service struct {
	repo *repository
}

func newService(db *sqlc.Queries) *service {
	return &service{repo: newRepository(db)}
}

func (s *service) viewVenues(ctx context.Context) (*viewVenuesResponse, error) {
	// TODO: Optimize by fetching amenities for all venues in a single query
	// instead of querying each venue individually inside the loop.
	venues, err := s.repo.getAllVenues(ctx)
	if err != nil {
		return nil, errors.New("Cannot get venues: " + err.Error())
	}

	if len(venues) == 0 {
		return nil, errors.New("No Rejected Venues")
	}

	rejectedVenues := &viewVenuesResponse{}

	for _, venue := range venues {
		amenities, err := s.repo.getAmenitiesForVenue(ctx, venue.ID)
		if err != nil {
			return nil, errors.New("Cannot fetch amenities")
		}

		images, err := s.repo.getVenueImagesByVenueID(ctx, venue.ID)
		if err != nil {
			return nil, errors.New("Cannot fetch images")
		}

		var imgURLS []string
		for _, img := range images {
			imgURL := strings.TrimPrefix(img.ImageUrl, "./internal/venues")
			imgURLS = append(imgURLS, imgURL)
		}
		fmt.Println(venue.ID)

		rejectedVenues.Venues = append(rejectedVenues.Venues, venueWithAmenitiesAndImages{
			Venue:     venue,
			Amenities: amenities,
			Images:    imgURLS,
		})
	}

	return rejectedVenues, nil
}

func (s *service) viewVenueByVenueID(ctx context.Context, venueID string) (sqlc.Venue, error) {
	venue, err := s.repo.getVenueByID(ctx, venueID)
	if err != nil {
		if err == sql.ErrNoRows {
			return sqlc.Venue{}, errors.New("venue not found")
		}
		return sqlc.Venue{}, err
	}

	return venue, nil
}

func (s *service) getBookedVenues(ctx context.Context, userID string) (*bookedVenuesResponse, error) {
	BookedVenues, err := s.repo.getBookedVenuesByUserID(ctx, userID)
	if err != nil {
		if err == sql.ErrNoRows {
			return &bookedVenuesResponse{}, nil
		}
		return nil, errors.New("cannot find booked venues")
	}
	var res bookedVenuesResponse

	for _, Bvenue := range BookedVenues {
		venue, err := s.repo.getVenueByID(ctx, Bvenue.VenueID.String())
		if err != nil {
			return nil, errors.New("venue not found: " + err.Error())
		}

		slot, err := s.repo.getslotByID(ctx, Bvenue.SlotID)
		if err != nil {
			return nil, errors.New("slot not found: " + err.Error())
		}

		date, endTime, exists := strings.Cut(slot.EndTime.Time.String(), " ")
		if !exists {
			date = slot.EndTime.Time.GoString()
		}
		_, start_time, _ := strings.Cut(slot.StartTime.Time.String(), " ")
		log.Println(Bvenue.TotalAmount)

		amount, err := utils.NumericToInt64(Bvenue.TotalAmount)
		if err != nil {
			return nil, err
		}

		response := bookedVenue{
			ID:     Bvenue.ID,
			Date:   date,
			Time:   start_time + " - " + endTime,
			Name:   venue.Name,
			Amount: amount,
		}
		res.Venues = append(res.Venues, response)
	}

	return &res, nil
}

type venueWithAmenitiesAndImages struct {
	Venue     sqlc.Venue     `json:"venue"`
	Amenities []sqlc.Amenity `json:"amenities"`
	Images    []string       `json:"images"`
}

type viewVenuesResponse struct {
	Venues []venueWithAmenitiesAndImages `json:"venues"`
}

type bookedVenue struct {
	ID     pgtype.UUID `json:"id"`
	Date   string      `json:"date"`
	Time   string      `json:"time"`
	Name   string      `json:"name"`
	Amount int64       `json:"amount"`
}

type bookedVenuesResponse struct {
	Venues []bookedVenue `json:"venues"`
}
