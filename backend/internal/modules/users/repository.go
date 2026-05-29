package users

import (
	"github.com/felipe/FitTrackPro/backend/internal/models"
	"github.com/felipe/FitTrackPro/backend/pkg/pagination"
	"gorm.io/gorm"
)

type Repository struct {
	db *gorm.DB
}

func NewRepository(db *gorm.DB) *Repository {
	return &Repository{db: db}
}

func (r *Repository) FindAll(p pagination.Params) ([]models.User, int64, error) {
	var users []models.User
	var total int64

	query := r.db.Model(&models.User{})

	if err := query.Count(&total).Error; err != nil {
		return nil, 0, err
	}

	if err := query.Offset(p.Offset()).Limit(p.PerPage).Order("id ASC").Find(&users).Error; err != nil {
		return nil, 0, err
	}

	return users, total, nil
}

func (r *Repository) FindByID(id uint) (*models.User, error) {
	var user models.User
	err := r.db.First(&user, id).Error
	if err != nil {
		return nil, err
	}
	return &user, nil
}

func (r *Repository) FindByEmail(email string) (*models.User, error) {
	var user models.User
	err := r.db.Where("email = ?", email).First(&user).Error
	if err != nil {
		return nil, err
	}
	return &user, nil
}

func (r *Repository) Create(user *models.User) error {
	return r.db.Create(user).Error
}

func (r *Repository) Update(user *models.User) error {
	return r.db.Save(user).Error
}

func (r *Repository) Delete(id uint) error {
	return r.db.Delete(&models.User{}, id).Error
}
