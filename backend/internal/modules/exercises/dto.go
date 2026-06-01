package exercises

import (
	"time"

	"github.com/felipe/FitTrackPro/backend/internal/models"
	"github.com/google/uuid"
)

type CreateExerciseRequest struct {
	Name             string   `json:"name"              binding:"required"`
	Description      *string  `json:"description,omitempty"`
	MuscleGroup      string   `json:"muscle_group"      binding:"required"`
	SecondaryMuscles []string `json:"secondary_muscles,omitempty"`
	Equipment        *string  `json:"equipment,omitempty"`
	VideoURL         *string  `json:"video_url,omitempty"`
	ImageURL         *string  `json:"image_url,omitempty"`
}

type UpdateExerciseRequest struct {
	Name             *string  `json:"name,omitempty"`
	Description      *string  `json:"description,omitempty"`
	MuscleGroup      *string  `json:"muscle_group,omitempty"`
	SecondaryMuscles []string `json:"secondary_muscles,omitempty"`
	Equipment        *string  `json:"equipment,omitempty"`
	VideoURL         *string  `json:"video_url,omitempty"`
	ImageURL         *string  `json:"image_url,omitempty"`
	IsActive         *bool    `json:"is_active,omitempty"`
}

type ExerciseResponse struct {
	ID               uuid.UUID `json:"id"`
	Name             string    `json:"name"`
	Description      *string   `json:"description,omitempty"`
	MuscleGroup      string    `json:"muscle_group"`
	SecondaryMuscles []string  `json:"secondary_muscles,omitempty"`
	Equipment        *string   `json:"equipment,omitempty"`
	VideoURL         *string   `json:"video_url,omitempty"`
	ImageURL         *string   `json:"image_url,omitempty"`
	IsActive         bool      `json:"is_active"`
	TrainerID        uuid.UUID `json:"trainer_id"`
	CreatedAt        time.Time `json:"created_at"`
	UpdatedAt        time.Time `json:"updated_at"`
}

func toExerciseResponse(e *models.Exercise) ExerciseResponse {
	return ExerciseResponse{
		ID:               e.ID,
		Name:             e.Name,
		Description:      e.Description,
		MuscleGroup:      e.MuscleGroup,
		SecondaryMuscles: e.SecondaryMuscles,
		Equipment:        e.Equipment,
		VideoURL:         e.VideoURL,
		ImageURL:         e.ImageURL,
		IsActive:         e.IsActive,
		TrainerID:        e.TrainerID,
		CreatedAt:        e.CreatedAt,
		UpdatedAt:        e.UpdatedAt,
	}
}

func toExerciseResponses(exercises []models.Exercise) []ExerciseResponse {
	result := make([]ExerciseResponse, len(exercises))
	for i, e := range exercises {
		result[i] = toExerciseResponse(&e)
	}
	return result
}
