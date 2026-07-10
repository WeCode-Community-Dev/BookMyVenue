package bookings

import (
	"context"
	"errors"
	"fmt"
	"time"

	"github.com/WeCode-Community-Dev/BookMyVenue/pkg/redis"
)

const (
	lockExpiry = 10 * time.Minute // how long slot is held
	lockPrefix = "lock:slot:"     // redis key prefix
)

type lock struct {
	redis *redis.Client
}

func newLock(redis *redis.Client) *lock {
	return &lock{redis: redis}
}

// tries to lock a slot for a specific user
// returns error if slot is already locked by someone else
func (l lock) aquire(ctx context.Context, slotID string, userID string) error {
	key := lockKey(slotID)
	locked, err := l.redis.SetNX(ctx, key, userID, lockExpiry)
	if err != nil {
		return errors.New("failed to place booking lock")
	}

	if !locked {
		// check who owns the slot
		lockOwner, err := l.redis.Get(ctx, key)
		if err != nil {
			return errors.New("failed to check lock owner")
		}

		if lockOwner == userID {
			return nil
		}
		// slot is already locked — find out how much time is left
		ttl, _ := l.redis.TTL(ctx, key)
		return fmt.Errorf("slot is already reserved by someone else. try again in %.0f seconds", ttl.Seconds())
	}

	return nil
}

// manually releases the lock
func (l lock) Release(ctx context.Context, slotID string) error {
	err := l.redis.Delete(ctx, lockKey(slotID))
	if err != nil {
		return errors.New("failed to release booking lock")
	}

	return nil
}

// checks if a slot is currently locked
func (l lock) IsLocked(ctx context.Context, slotID string) (bool, error) {
	return l.redis.Exists(ctx, lockKey(slotID))
}

// checks if the lock belongs to a specific user
// prevents user A from releasing user B's lock
func (l lock) IsOwner(ctx context.Context, slotID string, userID string) (bool, error) {
	lockedBy, err := l.redis.Get(ctx, lockKey(slotID))
	if err != nil {
		return false, errors.New("lock not found")
	}

	return lockedBy == userID, nil
}

func lockKey(slotID string) string {
	return lockPrefix + slotID
}
