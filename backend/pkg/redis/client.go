package redis

import (
	"context"
	"errors"
	"os"
	"time"

	"github.com/redis/go-redis/v9"
)

type Client struct {
	rdb *redis.Client
}

func NewClient() (*Client, error) {
	rdb := redis.NewClient((&redis.Options{
		Addr:     os.Getenv("REDIS_ADDR"),
		Password: os.Getenv("REDIS_PASSWORD"),
		DB:       0,

		// connectin pool settings
		PoolSize:     10,
		MinIdleConns: 2,

		// timeouts
		DialTimeout:  5 * time.Second,
		ReadTimeout:  5 * time.Second,
		WriteTimeout: 5 * time.Second,
	}))

	if err := rdb.Ping(context.Background()).Err(); err != nil {
		return nil, errors.New("failed to connect to redis: " + err.Error())
	}

	return &Client{rdb: rdb}, nil
}

func (c *Client) Set(ctx context.Context, key string, value string, expiry time.Duration) error {
	return c.rdb.Set(ctx, key, value, expiry).Err()
}

func (c *Client) Get(ctx context.Context, key string) (string, error) {
	return c.rdb.Get(ctx, key).Result()
}

func (c *Client) Delete(ctx context.Context, key string) error {
	return c.rdb.Del(ctx, key).Err()
}

func (c *Client) Exists(ctx context.Context, key string) (bool, error) {
	result, err := c.rdb.Exists(ctx, key).Result()
	if err != nil {
		return false, err
	}

	return result > 0, nil
}

// used for booking locks — only sets if key doesn't already exist
func (c *Client) SetNX(ctx context.Context, key string, value string, expiry time.Duration) (bool, error) {
	return c.rdb.SetNX(ctx, key, value, expiry).Result()
}

func (c *Client) TTL(ctx context.Context, key string) (time.Duration, error) {
	return c.rdb.TTL(ctx, key).Result()
}

// Close
func (c *Client) Close() error {
	return c.rdb.Close()
}
