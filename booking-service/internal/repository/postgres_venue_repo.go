package repository

import (
	"booking-service/internal/domain"
	"context"
	"encoding/json"
	"errors"

	"github.com/jackc/pgx/v5"
	"github.com/jackc/pgx/v5/pgxpool"
)

type postgresVenueRepo struct {
	db *pgxpool.Pool
}

// NewPostgresVenueRepository returns a VenueRepository backed by PostgreSQL.
func NewPostgresVenueRepository(db *pgxpool.Pool) domain.VenueRepository {
	return &postgresVenueRepo{db: db}
}

func (r *postgresVenueRepo) Create(v *domain.Venue) error {
	images, _ := json.Marshal(v.Images)
	amenities, _ := json.Marshal(v.Amenities)
	highlights, _ := json.Marshal(v.Highlights)
	q := `INSERT INTO venues (owner_id, name, description, location, city, category, capacity, price_per_hour, images, amenities, highlights)
	      VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11)
	      RETURNING id, created_at`
	return r.db.QueryRow(context.Background(), q,
		v.OwnerID, v.Name, v.Description, v.Location, v.City, v.Category,
		v.Capacity, v.PricePerHour, images, amenities, highlights,
	).Scan(&v.ID, &v.CreatedAt)
}

func scanVenue(row pgx.Row) (*domain.Venue, error) {
	var v domain.Venue
	var imagesRaw, amenitiesRaw, highlightsRaw []byte
	err := row.Scan(
		&v.ID, &v.OwnerID, &v.Name, &v.Description, &v.Location,
		&v.City, &v.Category, &v.Capacity, &v.PricePerHour,
		&imagesRaw, &amenitiesRaw, &highlightsRaw, &v.CreatedAt,
	)
	if err != nil {
		if errors.Is(err, pgx.ErrNoRows) {
			return nil, domain.ErrVenueNotFound
		}
		return nil, err
	}
	if len(imagesRaw) > 0 {
		json.Unmarshal(imagesRaw, &v.Images)
	}
	if len(amenitiesRaw) > 0 {
		json.Unmarshal(amenitiesRaw, &v.Amenities)
	}
	if len(highlightsRaw) > 0 {
		json.Unmarshal(highlightsRaw, &v.Highlights)
	}
	return &v, nil
}

func (r *postgresVenueRepo) GetByID(id string) (*domain.Venue, error) {
	q := `SELECT id, owner_id, name, description, location, city, category, capacity, price_per_hour, images, amenities, highlights, created_at
	      FROM venues WHERE id = $1`
	return scanVenue(r.db.QueryRow(context.Background(), q, id))
}

func (r *postgresVenueRepo) ListAll() ([]domain.Venue, error) {
	q := `SELECT id, owner_id, name, description, location, city, category, capacity, price_per_hour, images, amenities, highlights, created_at
	      FROM venues ORDER BY created_at DESC`
	return r.scanVenuesMulti(q)
}

func (r *postgresVenueRepo) ListByOwner(ownerID string) ([]domain.Venue, error) {
	q := `SELECT id, owner_id, name, description, location, city, category, capacity, price_per_hour, images, amenities, highlights, created_at
	      FROM venues WHERE owner_id = $1 ORDER BY created_at DESC`
	return r.scanVenuesMulti(q, ownerID)
}

func (r *postgresVenueRepo) Update(v *domain.Venue) error {
	images, _ := json.Marshal(v.Images)
	amenities, _ := json.Marshal(v.Amenities)
	highlights, _ := json.Marshal(v.Highlights)
	q := `UPDATE venues SET name=$1, description=$2, location=$3, city=$4, category=$5, capacity=$6, price_per_hour=$7, images=$8, amenities=$9, highlights=$10
	      WHERE id=$11`
	tag, err := r.db.Exec(context.Background(), q,
		v.Name, v.Description, v.Location, v.City, v.Category,
		v.Capacity, v.PricePerHour, images, amenities, highlights, v.ID,
	)
	if err != nil {
		return err
	}
	if tag.RowsAffected() == 0 {
		return domain.ErrVenueNotFound
	}
	return nil
}

func (r *postgresVenueRepo) Delete(id string) error {
	tag, err := r.db.Exec(context.Background(), `DELETE FROM venues WHERE id=$1`, id)
	if err != nil {
		return err
	}
	if tag.RowsAffected() == 0 {
		return domain.ErrVenueNotFound
	}
	return nil
}

// scanVenuesMulti runs a SELECT query and collects rows into a slice.
func (r *postgresVenueRepo) scanVenuesMulti(q string, args ...any) ([]domain.Venue, error) {
	rows, err := r.db.Query(context.Background(), q, args...)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var venues []domain.Venue
	for rows.Next() {
		v, err := scanVenue(rows)
		if err != nil {
			return nil, err
		}
		venues = append(venues, *v)
	}
	return venues, rows.Err()
}
