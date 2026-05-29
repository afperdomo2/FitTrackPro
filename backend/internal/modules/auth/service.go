package auth

import (
	"errors"

	"github.com/felipe/FitTrackPro/backend/internal/models"
	"golang.org/x/crypto/bcrypt"
)

var (
	ErrAdminExists = errors.New("admin user already exists, registration is disabled")
	ErrEmailTaken  = errors.New("email already registered")
)

type Service struct {
	repo *Repository
}

func NewService(repo *Repository) *Service {
	return &Service{repo: repo}
}

func (s *Service) Register(req RegisterRequest) (*models.User, error) {
	count, err := s.repo.CountAdmins()
	if err != nil {
		return nil, err
	}
	if count > 0 {
		return nil, ErrAdminExists
	}

	_, err = s.repo.FindByEmail(req.Email)
	if err == nil {
		return nil, ErrEmailTaken
	}

	hashedPassword, err := bcrypt.GenerateFromPassword([]byte(req.Password), bcrypt.DefaultCost)
	if err != nil {
		return nil, err
	}

	user := &models.User{
		Email:        req.Email,
		Name:         req.Name,
		PasswordHash: string(hashedPassword),
		Role:         models.RoleAdmin,
	}

	if err := s.repo.CreateUser(user); err != nil {
		return nil, err
	}

	return user, nil
}
