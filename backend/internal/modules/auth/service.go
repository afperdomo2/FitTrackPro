package auth

import (
	"errors"

	"github.com/felipe/FitTrackPro/backend/internal/models"
	jwtpkg "github.com/felipe/FitTrackPro/backend/pkg/jwt"
	"github.com/google/uuid"
	"golang.org/x/crypto/bcrypt"
)

var (
	ErrAdminExists        = errors.New("admin user already exists, registration is disabled")
	ErrEmailTaken         = errors.New("email already registered")
	ErrInvalidCredentials = errors.New("invalid credentials")
	ErrInvalidOldPassword = errors.New("current password is incorrect")
	ErrUserInactive       = errors.New("account is inactive, contact your administrator")
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

func (s *Service) Login(req LoginRequest, secret, expirationHours string) (*LoginResponse, error) {
	user, err := s.repo.FindByEmail(req.Email)
	if err != nil {
		return nil, ErrInvalidCredentials
	}

	if !user.IsActive {
		return nil, ErrUserInactive
	}

	if err := bcrypt.CompareHashAndPassword([]byte(user.PasswordHash), []byte(req.Password)); err != nil {
		return nil, ErrInvalidCredentials
	}

	token, err := jwtpkg.GenerateToken(user.ID, user.Email, user.Role, user.MustChangePassword, secret, expirationHours)
	if err != nil {
		return nil, err
	}

	return &LoginResponse{
		Token:              token,
		MustChangePassword: user.MustChangePassword,
		User: UserResponse{
			ID:    user.ID,
			Email: user.Email,
			Name:  user.Name,
			Role:  user.Role,
		},
	}, nil
}

func (s *Service) ChangePassword(userID uuid.UUID, req ChangePasswordRequest, secret, expirationHours string) (*LoginResponse, error) {
	user, err := s.repo.FindByID(userID)
	if err != nil {
		return nil, err
	}

	if err := bcrypt.CompareHashAndPassword([]byte(user.PasswordHash), []byte(req.OldPassword)); err != nil {
		return nil, ErrInvalidOldPassword
	}

	hashedPassword, err := bcrypt.GenerateFromPassword([]byte(req.NewPassword), bcrypt.DefaultCost)
	if err != nil {
		return nil, err
	}

	user.PasswordHash = string(hashedPassword)
	user.MustChangePassword = false

	if err := s.repo.UpdateUser(user); err != nil {
		return nil, err
	}

	token, err := jwtpkg.GenerateToken(user.ID, user.Email, user.Role, false, secret, expirationHours)
	if err != nil {
		return nil, err
	}

	return &LoginResponse{
		Token:              token,
		MustChangePassword: false,
		User: UserResponse{
			ID:    user.ID,
			Email: user.Email,
			Name:  user.Name,
			Role:  user.Role,
		},
	}, nil
}
