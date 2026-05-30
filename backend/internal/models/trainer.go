package models

import (
	"time"

	"github.com/google/uuid"
)

type Trainer struct {
	ID         uuid.UUID `gorm:"type:uuid;primaryKey;default:gen_random_uuid()" json:"id"`
	UserID     uuid.UUID `gorm:"type:uuid;uniqueIndex;not null" json:"user_id"`
	User       User      `gorm:"foreignKey:UserID" json:"-"`
	Speciality *string   `gorm:"size:255" json:"speciality,omitempty"`
	CreatedAt  time.Time `json:"created_at"`
	UpdatedAt  time.Time `json:"updated_at"`
}
