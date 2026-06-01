package trainers

import (
	"time"

	"github.com/felipe/FitTrackPro/backend/internal/models"
	"github.com/google/uuid"
)

type CreateTrainerRequest struct {
	Email      string  `json:"email"      binding:"required,email"`
	Name       string  `json:"name"       binding:"required"`
	Speciality *string `json:"speciality"`
}

type UpdateTrainerRequest struct {
	Name       *string `json:"name"`
	IsActive   *bool   `json:"is_active"`
	Speciality *string `json:"speciality"`
}

type TrainerResponse struct {
	ID         uuid.UUID `json:"id"`
	UserID     uuid.UUID `json:"user_id"`
	Name       string    `json:"name"`
	Email      string    `json:"email"`
	Role       string    `json:"role"`
	IsActive   bool      `json:"is_active"`
	Speciality *string   `json:"speciality,omitempty"`
	CreatedAt  time.Time `json:"created_at"`
	UpdatedAt  time.Time `json:"updated_at"`
}

func toTrainerResponse(t *models.Trainer) TrainerResponse {
	return TrainerResponse{
		ID:         t.ID,
		UserID:     t.User.ID,
		Name:       t.User.Name,
		Email:      t.User.Email,
		Role:       t.User.Role,
		IsActive:   t.User.IsActive,
		Speciality: t.Speciality,
		CreatedAt:  t.CreatedAt,
		UpdatedAt:  t.UpdatedAt,
	}
}

func toTrainerResponses(trainers []models.Trainer) []TrainerResponse {
	result := make([]TrainerResponse, len(trainers))
	for i, t := range trainers {
		result[i] = toTrainerResponse(&t)
	}
	return result
}
