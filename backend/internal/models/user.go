package models

import (
	"time"

	"gorm.io/gorm"
)

const (
	RoleAdmin   = "admin"
	RoleTrainer = "trainer"
	RoleClient  = "client"
)

type User struct {
	ID           uint           `gorm:"primaryKey" json:"id"`
	Email        string         `gorm:"uniqueIndex;size:255;not null" json:"email"`
	Name         string         `gorm:"size:255;not null" json:"name"`
	PasswordHash string         `gorm:"size:255;not null" json:"-"`
	Role               string           `gorm:"size:50;not null;default:'user'" json:"role"`
	IsActive           bool             `gorm:"default:true;not null" json:"is_active"`
	CreatedAt          time.Time        `json:"created_at"`
	UpdatedAt          time.Time        `json:"updated_at"`
	DeletedAt          gorm.DeletedAt   `gorm:"index" json:"-"`
	MustChangePassword bool             `gorm:"default:true" json:"-"`
}
