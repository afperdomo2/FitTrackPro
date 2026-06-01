package exercises

import (
	"github.com/felipe/FitTrackPro/backend/internal/models"
	"github.com/felipe/FitTrackPro/backend/pkg/pagination"
	"github.com/google/uuid"
	"gorm.io/gorm"
)

type Repository struct {
	db *gorm.DB
}

func NewRepository(db *gorm.DB) *Repository {
	return &Repository{db: db}
}

func (r *Repository) FindAll(p pagination.Params, isActive *bool, trainerID uuid.UUID) ([]models.Exercise, int64, error) {
	var exercises []models.Exercise
	var total int64

	query := r.db.Model(&models.Exercise{}).
		Where("trainer_id = ?", trainerID)

	if isActive != nil {
		query = query.Where("is_active = ?", *isActive)
	}

	if err := query.Count(&total).Error; err != nil {
		return nil, 0, err
	}

	if err := query.
		Offset(p.Offset()).
		Limit(p.PerPage).
		Order("created_at DESC").
		Find(&exercises).Error; err != nil {
		return nil, 0, err
	}

	return exercises, total, nil
}

func (r *Repository) FindByID(id uuid.UUID, trainerID uuid.UUID) (*models.Exercise, error) {
	var exercise models.Exercise
	err := r.db.
		Where("id = ? AND trainer_id = ?", id, trainerID).
		First(&exercise).Error
	if err != nil {
		return nil, err
	}
	return &exercise, nil
}

func (r *Repository) FindTrainerByUserID(userID uuid.UUID) (*models.Trainer, error) {
	var trainer models.Trainer
	err := r.db.Where("user_id = ?", userID).First(&trainer).Error
	if err != nil {
		return nil, err
	}
	return &trainer, nil
}

func (r *Repository) Create(exercise *models.Exercise) error {
	return r.db.Create(exercise).Error
}

func (r *Repository) Update(exercise *models.Exercise) error {
	return r.db.Save(exercise).Error
}

func (r *Repository) Delete(exercise *models.Exercise) error {
	return r.db.Delete(exercise).Error
}
