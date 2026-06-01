package models

import (
	"time"

	"github.com/google/uuid"
	"gorm.io/gorm"
)

type Exercise struct {
	ID               uuid.UUID      `gorm:"type:uuid;primaryKey;default:gen_random_uuid()" json:"id"`
	Name             string         `gorm:"size:255;not null" json:"name"`
	Description      *string        `gorm:"type:text" json:"description,omitempty"`
	MuscleGroup      string         `gorm:"size:100;not null;index" json:"muscle_group"`
	SecondaryMuscles []string       `gorm:"type:jsonb;serializer:json" json:"secondary_muscles,omitempty"`
	Equipment        *string        `gorm:"size:255" json:"equipment,omitempty"`
	VideoURL         *string        `gorm:"size:500" json:"video_url,omitempty"`
	ImageURL         *string        `gorm:"size:500" json:"image_url,omitempty"`
	IsActive         bool           `gorm:"default:true;not null;index" json:"is_active"`
	TrainerID        uuid.UUID      `gorm:"type:uuid;not null;index" json:"trainer_id"`
	Trainer          Trainer        `gorm:"foreignKey:TrainerID" json:"-"`
	CreatedAt        time.Time      `json:"created_at"`
	UpdatedAt        time.Time      `json:"updated_at"`
	DeletedAt        gorm.DeletedAt `gorm:"index" json:"-"`
}
