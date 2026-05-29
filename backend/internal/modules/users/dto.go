package users

import (
	"time"

	"github.com/felipe/FitTrackPro/backend/internal/models"
	"github.com/felipe/FitTrackPro/backend/pkg/pagination"
)

type UserResponse struct {
	ID        uint      `json:"id"`
	Email     string    `json:"email"`
	Name      string    `json:"name"`
	Role      string    `json:"role"`
	CreatedAt time.Time `json:"created_at"`
	UpdatedAt time.Time `json:"updated_at"`
}

type PaginatedUsersResponse struct {
	pagination.Response
}

func ToUserResponse(u *models.User) UserResponse {
	return UserResponse{
		ID:        u.ID,
		Email:     u.Email,
		Name:      u.Name,
		Role:      u.Role,
		CreatedAt: u.CreatedAt,
		UpdatedAt: u.UpdatedAt,
	}
}

func ToUserResponses(users []models.User) []UserResponse {
	result := make([]UserResponse, len(users))
	for i, u := range users {
		result[i] = ToUserResponse(&u)
	}
	return result
}