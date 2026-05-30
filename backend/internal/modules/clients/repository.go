package clients

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

func (r *Repository) FindAll(p pagination.Params, isActive *bool, trainerID uuid.UUID) ([]models.Client, int64, error) {
	var clients []models.Client
	var total int64

	query := r.db.Model(&models.Client{}).
		Joins("JOIN users ON users.id = clients.user_id AND users.deleted_at IS NULL").
		Where("clients.trainer_id = ?", trainerID)

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
		Order("clients.id ASC").
		Find(&clients).Error; err != nil {
		return nil, 0, err
	}

	return clients, total, nil
}

func (r *Repository) FindByID(id uuid.UUID, trainerID uuid.UUID) (*models.Client, error) {
	var client models.Client
	err := r.db.
		Preload("User").
		Joins("JOIN users ON users.id = clients.user_id AND users.deleted_at IS NULL").
		Where("clients.id = ? AND clients.trainer_id = ?", id, trainerID).
		First(&client).Error
	if err != nil {
		return nil, err
	}
	return &client, nil
}

func (r *Repository) FindByEmail(email string) (*models.User, error) {
	var user models.User
	err := r.db.Where("email = ?", email).First(&user).Error
	if err != nil {
		return nil, err
	}
	return &user, nil
}

func (r *Repository) FindTrainerByUserID(userID uuid.UUID) (*models.Trainer, error) {
	var trainer models.Trainer
	err := r.db.Where("user_id = ?", userID).First(&trainer).Error
	if err != nil {
		return nil, err
	}
	return &trainer, nil
}

func (r *Repository) CreateClientWithUser(user *models.User, client *models.Client) error {
	return r.db.Transaction(func(tx *gorm.DB) error {
		if err := tx.Create(user).Error; err != nil {
			return err
		}
		client.UserID = user.ID
		if err := tx.Create(client).Error; err != nil {
			return err
		}
		return nil
	})
}

func (r *Repository) UpdateClientWithUser(client *models.Client, user *models.User) error {
	return r.db.Transaction(func(tx *gorm.DB) error {
		if err := tx.Save(client).Error; err != nil {
			return err
		}
		if err := tx.Model(user).Select("name", "is_active", "updated_at").Updates(user).Error; err != nil {
			return err
		}
		return nil
	})
}

func (r *Repository) DeleteUserByID(id uuid.UUID) error {
	return r.db.Delete(&models.User{}, id).Error
}
