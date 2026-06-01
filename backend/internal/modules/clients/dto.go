package clients

import (
	"time"

	"github.com/felipe/FitTrackPro/backend/internal/models"
	"github.com/google/uuid"
)

type CreateClientRequest struct {
	Email        string   `json:"email"        binding:"required,email"`
	Name         string   `json:"name"         binding:"required"`
	Goal         *string  `json:"goal"`
	FitnessLevel *string  `json:"fitness_level"`
	Weight       *float64 `json:"weight"`
	Height       *float64 `json:"height"`
	BirthDate    *string  `json:"birth_date"`
}

type UpdateClientRequest struct {
	Name         *string  `json:"name"`
	IsActive     *bool    `json:"is_active"`
	Goal         *string  `json:"goal"`
	FitnessLevel *string  `json:"fitness_level"`
	Weight       *float64 `json:"weight"`
	Height       *float64 `json:"height"`
	BirthDate    *string  `json:"birth_date"`
}

type ClientResponse struct {
	ID           uuid.UUID  `json:"id"`
	UserID       uuid.UUID  `json:"user_id"`
	TrainerID    uuid.UUID  `json:"trainer_id"`
	Name         string     `json:"name"`
	Email        string     `json:"email"`
	Role         string     `json:"role"`
	IsActive     bool       `json:"is_active"`
	Goal         *string    `json:"goal,omitempty"`
	FitnessLevel *string    `json:"fitness_level,omitempty"`
	Weight       *float64   `json:"weight,omitempty"`
	Height       *float64   `json:"height,omitempty"`
	BirthDate    *time.Time `json:"birth_date,omitempty"`
	CreatedAt    time.Time  `json:"created_at"`
	UpdatedAt    time.Time  `json:"updated_at"`
}

func toClientResponse(c *models.Client) ClientResponse {
	return ClientResponse{
		ID:           c.ID,
		UserID:       c.User.ID,
		TrainerID:    c.TrainerID,
		Name:         c.User.Name,
		Email:        c.User.Email,
		Role:         c.User.Role,
		IsActive:     c.User.IsActive,
		Goal:         c.Goal,
		FitnessLevel: c.FitnessLevel,
		Weight:       c.Weight,
		Height:       c.Height,
		BirthDate:    c.BirthDate,
		CreatedAt:    c.CreatedAt,
		UpdatedAt:    c.UpdatedAt,
	}
}

func toClientResponses(clients []models.Client) []ClientResponse {
	result := make([]ClientResponse, len(clients))
	for i, c := range clients {
		result[i] = toClientResponse(&c)
	}
	return result
}
