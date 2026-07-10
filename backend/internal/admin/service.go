package admin

import (
	"context"
	"errors"
	"strings"

	"github.com/WeCode-Community-Dev/BookMyVenue/db/sqlc"
	"github.com/jackc/pgx/v5/pgtype"
)

type service struct {
	repo *repository
}

func newService(db *sqlc.Queries) *service {
	return &service{repo: newRepository(db)}
}

func (s *service) viewPendingVenues(ctx context.Context) (*viewVenuesResponse, error) {
	venues, err := s.repo.getAllPendingVenues(ctx)
	if err != nil {
		return nil, err
	}

	if len(venues) == 0 {
		return nil, errors.New("No Rejected Venues")
	}

	var venueIDs []pgtype.UUID
	amenityMap := make(map[pgtype.UUID][]string)
	imageMap := make(map[pgtype.UUID][]string)

	for _, venue := range venues {
		venueIDs = append(venueIDs, venue.ID)
	}

	amenities, err := s.repo.getVenueAmenitiesByVenueIDs(ctx, venueIDs)
	if err != nil {
		return nil, errors.New("cannot fetch amenities")
	}

	images, err := s.repo.getVenueImagesByVenueIDs(ctx, venueIDs)
	if err != nil {
		return nil, errors.New("Cannot fetch images")
	}

	for _, amenity := range amenities {
		amenityMap[amenity.VenueID] = append(amenityMap[amenity.VenueID], amenity.Name)
	}

	for _, image := range images {
		imgURL := strings.TrimPrefix(image.ImageUrl, "./internal/venues")
		imageMap[image.VenueID] = append(imageMap[image.VenueID], imgURL)
	}

	pendingVenues := &viewVenuesResponse{}

	for _, venue := range venues {
		pendingVenues.Venues = append(pendingVenues.Venues, venueWithAmenitiesAndImages{
			Venue:     venue,
			Amenities: amenityMap[venue.ID],
			Images:    imageMap[venue.ID],
		})
	}

	return pendingVenues, nil
}

func (s *service) approveVenue(ctx context.Context, venueID string) error {
	venue, err := s.repo.getVenueByVenueID(ctx, venueID)
	if err != nil {
		return errors.New("Cannot get venue: " + err.Error())
	}

	err = s.repo.approveVenue(ctx, venue.ID)
	if err != nil {
		return errors.New("Cannot approve venue: " + err.Error())
	}

	return nil
}

func (s *service) rejectVenue(ctx context.Context, venueID string) error {
	venue, err := s.repo.getVenueByVenueID(ctx, venueID)
	if err != nil {
		return errors.New("Cannot get venue: " + err.Error())
	}

	err = s.repo.rejectVenue(ctx, venue.ID)
	if err != nil {
		return errors.New("Cannot reject venue: " + err.Error())
	}

	return nil
}

func (s *service) viewApprovedVenues(ctx context.Context) (*viewVenuesResponse, error) {
	venues, err := s.repo.getAllApprovedVenues(ctx)
	if err != nil {
		return nil, errors.New("Cannot get venues: " + err.Error())
	}

	if len(venues) == 0 {
		return nil, errors.New("No Rejected Venues")
	}

	var venueIDs []pgtype.UUID
	amenityMap := make(map[pgtype.UUID][]string)
	imageMap := make(map[pgtype.UUID][]string)

	for _, venue := range venues {
		venueIDs = append(venueIDs, venue.ID)
	}

	amenities, err := s.repo.getVenueAmenitiesByVenueIDs(ctx, venueIDs)
	if err != nil {
		return nil, errors.New("cannot fetch amenities")
	}

	images, err := s.repo.getVenueImagesByVenueIDs(ctx, venueIDs)
	if err != nil {
		return nil, errors.New("Cannot fetch images")
	}

	for _, amenity := range amenities {
		amenityMap[amenity.VenueID] = append(amenityMap[amenity.VenueID], amenity.Name)
	}

	for _, image := range images {
		imgURL := strings.TrimPrefix(image.ImageUrl, "./internal/venues")
		imageMap[image.VenueID] = append(imageMap[image.VenueID], imgURL)
	}

	approvedVenues := &viewVenuesResponse{}

	for _, venue := range venues {
		approvedVenues.Venues = append(approvedVenues.Venues, venueWithAmenitiesAndImages{
			Venue:     venue,
			Amenities: amenityMap[venue.ID],
			Images:    imageMap[venue.ID],
		})
	}

	return approvedVenues, nil
}

func (s *service) viewRejectedVenues(ctx context.Context) (*viewVenuesResponse, error) {
	venues, err := s.repo.getAllRejectedVenues(ctx)
	if err != nil {
		return nil, errors.New("Cannot get venues: " + err.Error())
	}

	if len(venues) == 0 {
		return nil, errors.New("No Rejected Venues")
	}

	var venueIDs []pgtype.UUID
	amenityMap := make(map[pgtype.UUID][]string)
	imageMap := make(map[pgtype.UUID][]string)

	for _, venue := range venues {
		venueIDs = append(venueIDs, venue.ID)
	}

	amenities, err := s.repo.getVenueAmenitiesByVenueIDs(ctx, venueIDs)
	if err != nil {
		return nil, errors.New("cannot fetch amenities")
	}

	images, err := s.repo.getVenueImagesByVenueIDs(ctx, venueIDs)
	if err != nil {
		return nil, errors.New("Cannot fetch images")
	}

	for _, amenity := range amenities {
		amenityMap[amenity.VenueID] = append(amenityMap[amenity.VenueID], amenity.Name)
	}

	for _, image := range images {
		imgURL := strings.TrimPrefix(image.ImageUrl, "./internal/venues")
		imageMap[image.VenueID] = append(imageMap[image.VenueID], imgURL)
	}

	rejectedVenues := &viewVenuesResponse{}

	for _, venue := range venues {
		rejectedVenues.Venues = append(rejectedVenues.Venues, venueWithAmenitiesAndImages{
			Venue:     venue,
			Amenities: amenityMap[venue.ID],
			Images:    imageMap[venue.ID],
		})
	}

	return rejectedVenues, nil
}

type venueWithAmenitiesAndImages struct {
	Venue     sqlc.Venue `json:"venue"`
	Amenities []string   `json:"amenities"`
	Images    []string   `json:"images"`
}

type viewVenuesResponse struct {
	Venues []venueWithAmenitiesAndImages `json:"venues"`
}
