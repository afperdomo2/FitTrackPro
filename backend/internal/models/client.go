package models

import (
	"time"

	"github.com/google/uuid"
)

type Client struct {
	ID           uuid.UUID  `gorm:"type:uuid;primaryKey;default:gen_random_uuid()" json:"id"`
	UserID       uuid.UUID  `gorm:"type:uuid;uniqueIndex;not null" json:"user_id"`
	User         User       `gorm:"foreignKey:UserID" json:"-"`
	TrainerID    uuid.UUID  `gorm:"type:uuid;index;not null" json:"trainer_id"`
	Trainer      Trainer    `gorm:"foreignKey:TrainerID" json:"-"`
	Goal         *string    `gorm:"size:255" json:"goal,omitempty"`
	FitnessLevel *string    `gorm:"size:50" json:"fitness_level,omitempty"`
	Weight       *float64   `json:"weight,omitempty"`
	Height       *float64   `json:"height,omitempty"`
	BirthDate    *time.Time `json:"birth_date,omitempty"`
	CreatedAt    time.Time  `json:"created_at"`
	UpdatedAt    time.Time  `json:"updated_at"`
}
