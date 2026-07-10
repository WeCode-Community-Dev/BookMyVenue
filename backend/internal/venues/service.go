package venues

import (
	"context"
	"errors"
	"mime/multipart"
	"strings"

	"github.com/WeCode-Community-Dev/BookMyVenue/db/sqlc"
	"github.com/WeCode-Community-Dev/BookMyVenue/pkg/utils"
	"github.com/gin-gonic/gin"
	"github.com/jackc/pgx/v5/pgtype"
)

// service contains the business logic for venue management.
// It coordinates repository operations and image storage.
type service struct {
	repo    *repository
	ImageDB *uploadImage
}

func newService(db *sqlc.Queries) *service {
	return &service{
		repo:    newRepository(db),
		ImageDB: newUploadImage(),
	}
}

// addVenue validates the request and creates a new venue owned by the given user.
func (s *service) addVenue(ctx context.Context, req CreateVenueRequest, ownerID string) (*sqlc.Venue, error) {

	// validate capacity
	if req.Capacity <= 0 {
		return nil, errors.New("capacity must be greater than 0")
	}

	// validate price
	if req.PricePerDay <= 0 {
		return nil, errors.New("price per day must be greater than 0")
	}

	if req.PricePerHour <= 0 {
		return nil, errors.New("price per hour must be greater than 0")
	}

	ownerUUID, err := utils.StringToUUID(ownerID)
	if err != nil {
		return nil, err
	}

	venue, err := s.repo.createVenue(ctx, sqlc.CreateVenueParams{
		OwnerID:      ownerUUID,
		Name:         req.Name,
		Description:  &req.Description,
		Category:     req.Category,
		Address:      req.Address,
		City:         req.City,
		State:        req.State,
		Pincode:      &req.Pincode,
		Capacity:     &req.Capacity,
		PricePerHour: req.PricePerHour,
		PricePerDay:  req.PricePerDay,
	})
	if err != nil {
		return nil, errors.New("failed to add Venue:" + err.Error())
	}
	return &venue, nil
}

func (s *service) assignAmenityToVenue(ctx context.Context, venueID, amenityID pgtype.UUID) error {

	if err := s.repo.assignAmenityToVenue(ctx, sqlc.AssignAmenityToVenueParams{
		VenueID:   venueID,
		AmenityID: amenityID,
	}); err != nil {
		return errors.New("Amenity can't assigned to venue")
	}

	return nil
}

// TODO: This logic may become redundant once amenities are managed as a
// predefined list. Currently amenities are created on demand because the
// system is not seeded yet. In the future, replace this with amenity
// validation/lookup and store amenity IDs instead of creating records.
func (s *service) addAmenities(ctx context.Context, amenities []string, venueID pgtype.UUID) error {
	if len(amenities) == 0 {
		return errors.New("amenities not found")
	}

	var failedAmenities []string

	for _, am := range amenities {
		amenity, err := s.repo.createAmenity(ctx, am)
		if err != nil {
			failedAmenities = append(failedAmenities, am)
		}

		err = s.assignAmenityToVenue(ctx, venueID, amenity.ID)
		if err != nil {
			return err
		}

	}
	if len(failedAmenities) > 0 {
		return errors.New("failed to create amenities: " + strings.Join(failedAmenities, ", "))
	}
	return nil
}

// uploadImage stores an image for a venue after verifying that the venue exists
// and records the uploaded image in the database.
func (s *service) uploadImage(ctx *gin.Context, venueID, ownerID string, file *multipart.FileHeader, filename string) (*sqlc.VenueImage, error) {
	venue, err := s.repo.getVenueByID(ctx.Request.Context(), venueID)
	if err != nil {
		return nil, errors.New("Venue not found")
	}

	if venue.OwnerID.String() != ownerID {
		return nil, errors.New("unauthorized: you do not own this venue")
	}

	filepath, err := s.ImageDB.saveImage(ctx, file, filename)

	img, err := s.repo.addVenueImage(ctx.Request.Context(), sqlc.AddVenueImageParams{
		VenueID:  venue.ID,
		ImageUrl: filepath,
	})
	if err != nil {
		return nil, errors.New("cannot save venue image")
	}
	return &img, nil
}

func (s *service) viewRejectedVenues(ctx context.Context, ownerID string) (*viewVenuesResponse, error) {
	venues, err := s.repo.getRejectedVenuesByOwnerID(ctx, ownerID)
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

func (s *service) viewPendingVenues(ctx context.Context, ownerID string) (*viewVenuesResponse, error) {
	venues, err := s.repo.getPendingVenuesByOwnerID(ctx, ownerID)
	if err != nil {
		return nil, err
	}

	if len(venues) == 0 {
		return nil, errors.New("No Pending Venues")
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

func (s *service) viewApprovedVenues(ctx context.Context, ownerID string) (*viewVenuesResponse, error) {
	venues, err := s.repo.getApprovedVenuesByOwnerID(ctx, ownerID)
	if err != nil {
		return nil, err
	}

	if len(venues) == 0 {
		return nil, errors.New("No Approved Venues")
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

type venueWithAmenitiesAndImages struct {
	Venue     sqlc.Venue `json:"venue"`
	Amenities []string   `json:"amenities"`
	Images    []string   `json:"images"`
}

type viewVenuesResponse struct {
	Venues []venueWithAmenitiesAndImages `json:"venues"`
}
