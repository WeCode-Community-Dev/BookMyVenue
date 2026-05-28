package repository

import (
	"booking-service/internal/domain"
	"context"
	"encoding/json"
	"errors"
	"time"

	"github.com/redis/go-redis/v9"
)

const cacheTTL = time.Hour

type redisBookingCache struct {
	client *redis.Client
}

// NewRedisBookingCache returns a BookingCache backed by Redis.
func NewRedisBookingCache(client *redis.Client) domain.BookingCache {
	return &redisBookingCache{client: client}
}

func key(id string) string { return "booking:" + id }

func (r *redisBookingCache) Set(b *domain.Booking) error {
	data, err := json.Marshal(b)
	if err != nil {
		return err
	}
	return r.client.Set(context.Background(), key(b.ID), data, cacheTTL).Err()
}

// Get returns ErrBookingNotFound on a cache miss so the service layer can
// fall through to the database transparently.
func (r *redisBookingCache) Get(id string) (*domain.Booking, error) {
	data, err := r.client.Get(context.Background(), key(id)).Bytes()
	if err != nil {
		if errors.Is(err, redis.Nil) {
			return nil, domain.ErrBookingNotFound
		}
		return nil, err
	}
	var b domain.Booking
	if err := json.Unmarshal(data, &b); err != nil {
		return nil, err
	}
	return &b, nil
}

func (r *redisBookingCache) Delete(id string) error {
	return r.client.Del(context.Background(), key(id)).Err()
}
