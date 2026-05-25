package repositories

import (
	"github.com/WeCode-Community-Dev/BookMyVenue/api/database"
	"github.com/WeCode-Community-Dev/BookMyVenue/api/models"
	"gorm.io/gorm"
)

type UserRepository interface {
	Create(user *models.User) error
	Search(name string, email string, mobileNumber string, Status models.UserStatus) ([]models.User, error)
	FindByID(id uint) (*models.User, error)
	FindByEmail(email string) (*models.User, error)
	FindByMobileNumber(mobileNumber string) (*models.User, error)
	UpdateByID(id uint, user *models.User) error
	DeleteByID(id uint) error
}

type userRepository struct {
	db *gorm.DB
}

func NewUserRepository() UserRepository {
	return &userRepository{
		db: database.ConnectPostgres(),
	}
}

func (r *userRepository) Create(user *models.User) error {
	return r.db.Create(user).Error
}

func (r *userRepository) Search(name string, email string, mobileNumber string, Status models.UserStatus) ([]models.User, error) {
	var users []models.User
	query := r.db.Model(&models.User{})

	if name != "" {
		query = query.Where("name LIKE ?", "%"+name+"%")
	}
	if email != "" {
		query = query.Where("email LIKE ?", "%"+email+"%")
	}
	if mobileNumber != "" {
		query = query.Where("mobile_number LIKE ?", "%"+mobileNumber+"%")
	}
	if Status != 0 {
		query = query.Where("status = ?", Status)
	}
	err := query.Find(&users).Error
	return users, err
}

func (r *userRepository) FindByID(id uint) (*models.User, error) {
	var user models.User
	err := r.db.First(&user, id).Error
	if err != nil {
		return nil, err
	}
	return &user, nil
}

func (r *userRepository) FindByEmail(email string) (*models.User, error) {
	var user models.User
	err := r.db.Where("email = ?", email).First(&user).Error
	if err != nil {
		return nil, err
	}
	return &user, nil
}

func (r *userRepository) FindByMobileNumber(mobileNumber string) (*models.User, error) {
	var user models.User
	err := r.db.Where("mobile_number = ?", mobileNumber).First(&user).Error
	if err != nil {
		return nil, err
	}
	return &user, nil
}

func (r *userRepository) UpdateByID(id uint, user *models.User) error {
	return r.db.Model(&models.User{}).Where("id = ?", id).Updates(user).Error
}

func (r *userRepository) DeleteByID(id uint) error {
	return r.db.Unscoped().Delete(&models.User{}, id).Error
}
