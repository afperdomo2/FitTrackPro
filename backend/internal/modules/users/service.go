package users

import (
	"errors"

	"github.com/felipe/FitTrackPro/backend/internal/models"
	"github.com/felipe/FitTrackPro/backend/pkg/pagination"
	"golang.org/x/crypto/bcrypt"
	"gorm.io/gorm"
)

var (
	ErrEmailTaken = errors.New("email already registered")
)

type Service struct {
	repo *Repository
}

func NewService(repo *Repository) *Service {
	return &Service{repo: repo}
}

func (s *Service) ListUsers(p pagination.Params) ([]UserResponse, pagination.Meta, error) {
	users, total, err := s.repo.FindAll(p)
	if err != nil {
		return nil, pagination.Meta{}, err
	}

	return ToUserResponses(users), pagination.BuildMeta(p, total), nil
}

func (s *Service) GetUser(id uint) (*UserResponse, error) {
	user, err := s.repo.FindByID(id)
	if err != nil {
		return nil, err
	}
	resp := ToUserResponse(user)
	return &resp, nil
}

func (s *Service) CreateUser(req CreateUserRequest, defaultPassword string) (*UserResponse, error) {
	_, err := s.repo.FindByEmail(req.Email)
	if err == nil {
		return nil, ErrEmailTaken
	}
	if !errors.Is(err, gorm.ErrRecordNotFound) {
		return nil, err
	}

	hashedPassword, err := bcrypt.GenerateFromPassword([]byte(defaultPassword), bcrypt.DefaultCost)
	if err != nil {
		return nil, err
	}

	user := &models.User{
		Email:              req.Email,
		Name:               req.Name,
		PasswordHash:       string(hashedPassword),
		Role:               req.Role,
		MustChangePassword: true,
	}

	if err := s.repo.Create(user); err != nil {
		return nil, err
	}

	resp := ToUserResponse(user)
	return &resp, nil
}

func (s *Service) UpdateUser(id uint, req UpdateUserRequest) (*UserResponse, error) {
	user, err := s.repo.FindByID(id)
	if err != nil {
		return nil, err
	}

	user.Name = req.Name

	if err := s.repo.Update(user); err != nil {
		return nil, err
	}

	resp := ToUserResponse(user)
	return &resp, nil
}

func (s *Service) DeleteUser(id uint) error {
	user, err := s.repo.FindByID(id)
	if err != nil {
		return err
	}
	return s.repo.Delete(user.ID)
}
