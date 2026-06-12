package users

import (
	"context"
	"errors"
	"fmt"
	"strings"

	"github.com/WeCode-Community-Dev/BookMyVenue/db/sqlc"
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

type venueWithAmenitiesAndImages struct {
	Venue     sqlc.Venue     `json:"venue"`
	Amenities []sqlc.Amenity `json:"amenities"`
	Images    []string       `json:"images"`
}

type viewVenuesResponse struct {
	Venues []venueWithAmenitiesAndImages `json:"venues"`
}
