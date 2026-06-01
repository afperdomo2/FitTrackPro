package clients

import (
	"errors"
	"time"

	"github.com/felipe/FitTrackPro/backend/internal/models"
	"github.com/felipe/FitTrackPro/backend/pkg/pagination"
	"github.com/google/uuid"
	"golang.org/x/crypto/bcrypt"
	"gorm.io/gorm"
)

var (
	ErrEmailTaken      = errors.New("email already exists")
	ErrClientNotFound  = errors.New("client not found")
	ErrTrainerNotFound = errors.New("trainer profile not found")
)

type Service struct {
	repo *Repository
}

func NewService(repo *Repository) *Service {
	return &Service{repo: repo}
}

func (s *Service) ListClients(p pagination.Params, isActive *bool, userID uuid.UUID) ([]ClientResponse, pagination.Meta, error) {
	trainer, err := s.repo.FindTrainerByUserID(userID)
	if err != nil {
		return nil, pagination.Meta{}, ErrTrainerNotFound
	}

	clients, total, err := s.repo.FindAll(p, isActive, trainer.ID)
	if err != nil {
		return nil, pagination.Meta{}, err
	}

	return toClientResponses(clients), pagination.BuildMeta(p, total), nil
}

func (s *Service) CreateClient(req CreateClientRequest, userID uuid.UUID, defaultPassword string) (*ClientResponse, error) {
	trainer, err := s.repo.FindTrainerByUserID(userID)
	if err != nil {
		return nil, ErrTrainerNotFound
	}

	existing, err := s.repo.FindByEmail(req.Email)
	if err == nil && existing != nil {
		return nil, ErrEmailTaken
	}
	if err != nil && !errors.Is(err, gorm.ErrRecordNotFound) {
		return nil, err
	}

	hashedPassword, err := bcrypt.GenerateFromPassword([]byte(defaultPassword), bcrypt.DefaultCost)
	if err != nil {
		return nil, err
	}

	user := &models.User{
		Email:        req.Email,
		Name:         req.Name,
		PasswordHash: string(hashedPassword),
		Role:         models.RoleClient,
	}

	client := &models.Client{
		TrainerID:    trainer.ID,
		Goal:         req.Goal,
		FitnessLevel: req.FitnessLevel,
		Weight:       req.Weight,
		Height:       req.Height,
	}

	if req.BirthDate != nil {
		t, err := time.Parse("2006-01-02", *req.BirthDate)
		if err == nil {
			client.BirthDate = &t
		}
	}

	if err := s.repo.CreateClientWithUser(user, client); err != nil {
		return nil, err
	}

	client.User = *user
	resp := toClientResponse(client)
	return &resp, nil
}

func (s *Service) GetClient(id uuid.UUID, userID uuid.UUID) (*ClientResponse, error) {
	trainer, err := s.repo.FindTrainerByUserID(userID)
	if err != nil {
		return nil, ErrTrainerNotFound
	}

	client, err := s.repo.FindByID(id, trainer.ID)
	if err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return nil, ErrClientNotFound
		}
		return nil, err
	}

	resp := toClientResponse(client)
	return &resp, nil
}

func (s *Service) UpdateClient(id uuid.UUID, req UpdateClientRequest, userID uuid.UUID) (*ClientResponse, error) {
	trainer, err := s.repo.FindTrainerByUserID(userID)
	if err != nil {
		return nil, ErrTrainerNotFound
	}

	client, err := s.repo.FindByID(id, trainer.ID)
	if err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return nil, ErrClientNotFound
		}
		return nil, err
	}

	if req.Goal != nil {
		client.Goal = req.Goal
	}
	if req.FitnessLevel != nil {
		client.FitnessLevel = req.FitnessLevel
	}
	if req.Weight != nil {
		client.Weight = req.Weight
	}
	if req.Height != nil {
		client.Height = req.Height
	}
	if req.BirthDate != nil {
		t, err := time.Parse("2006-01-02", *req.BirthDate)
		if err == nil {
			client.BirthDate = &t
		}
	}

	user := &client.User
	if req.Name != nil {
		user.Name = *req.Name
	}
	if req.IsActive != nil {
		user.IsActive = *req.IsActive
	}

	if err := s.repo.UpdateClientWithUser(client, user); err != nil {
		return nil, err
	}

	resp := toClientResponse(client)
	return &resp, nil
}

func (s *Service) DeleteClient(id uuid.UUID, userID uuid.UUID) error {
	trainer, err := s.repo.FindTrainerByUserID(userID)
	if err != nil {
		return ErrTrainerNotFound
	}

	client, err := s.repo.FindByID(id, trainer.ID)
	if err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return ErrClientNotFound
		}
		return err
	}

	return s.repo.DeleteUserByID(client.UserID)
}
