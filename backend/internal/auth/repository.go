package auth

import (
	"context"
	"errors"

	"github.com/WeCode-Community-Dev/BookMyVenue/db/sqlc"
	"github.com/WeCode-Community-Dev/BookMyVenue/pkg/utils"
)

type repository struct {
	db *sqlc.Queries
}

func newRepository(db *sqlc.Queries) *repository {
	return &repository{db: db}
}

func (r *repository) getUserByEmail(ctx context.Context, email string) (sqlc.User, error) {
	return r.db.GetUserByEmail(ctx, email)
}

func (r *repository) createUser(ctx context.Context, params sqlc.CreateUserParams) (sqlc.User, error) {
	return r.db.CreateUser(ctx, params)
}

func (r *repository) getUserByID(ctx context.Context, userID string) (sqlc.User, error) {
	userUUID, err := utils.StringToUUID(userID)
	if err != nil {
		return sqlc.User{}, errors.New(err.Error())
	}
	return r.db.GetUserByID(ctx, userUUID)
}
