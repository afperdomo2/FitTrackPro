package trainers

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

func (r *Repository) FindAll(p pagination.Params, isActive *bool) ([]models.Trainer, int64, error) {
	var trainers []models.Trainer
	var total int64

	query := r.db.Model(&models.Trainer{}).
		Joins("JOIN users ON users.id = trainers.user_id AND users.deleted_at IS NULL")

	if isActive != nil {
		query = query.Where("users.is_active = ?", *isActive)
	}

	if err := query.Count(&total).Error; err != nil {
		return nil, 0, err
	}

	if err := query.
		Preload("User").
		Offset(p.Offset()).
		Limit(p.PerPage).
		Order("trainers.id ASC").
		Find(&trainers).Error; err != nil {
		return nil, 0, err
	}

	return trainers, total, nil
}

func (r *Repository) FindByID(id uuid.UUID) (*models.Trainer, error) {
	var trainer models.Trainer
	err := r.db.
		Preload("User").
		Joins("JOIN users ON users.id = trainers.user_id AND users.deleted_at IS NULL").
		Where("trainers.id = ?", id).
		First(&trainer).Error
	if err != nil {
		return nil, err
	}
	return &trainer, nil
}

func (r *Repository) FindByEmail(email string) (*models.User, error) {
	var user models.User
	err := r.db.Where("email = ?", email).First(&user).Error
	if err != nil {
		return nil, err
	}
	return &user, nil
}

func (r *Repository) CreateTrainerWithUser(user *models.User, trainer *models.Trainer) error {
	return r.db.Transaction(func(tx *gorm.DB) error {
		if err := tx.Create(user).Error; err != nil {
			return err
		}
		trainer.UserID = user.ID
		if err := tx.Create(trainer).Error; err != nil {
			return err
		}
		return nil
	})
}

func (r *Repository) UpdateTrainer(trainer *models.Trainer) error {
	return r.db.Save(trainer).Error
}

func (r *Repository) UpdateTrainerWithUser(trainer *models.Trainer, user *models.User) error {
	return r.db.Transaction(func(tx *gorm.DB) error {
		if err := tx.Save(trainer).Error; err != nil {
			return err
		}
		if err := tx.Model(user).Select("name", "is_active", "updated_at").Updates(user).Error; err != nil {
			return err
		}
		return nil
	})
}

func (r *Repository) UpdateUser(user *models.User) error {
	return r.db.Model(user).Select("name", "is_active", "updated_at").Updates(user).Error
}

func (r *Repository) DeleteUser(id uuid.UUID) error {
	return r.db.Delete(&models.User{}, id).Error
}
