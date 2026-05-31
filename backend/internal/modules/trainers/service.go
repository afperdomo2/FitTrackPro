package trainers

import (
	"errors"
	"log"

	"github.com/felipe/FitTrackPro/backend/internal/models"
	"github.com/felipe/FitTrackPro/backend/pkg/pagination"
	"github.com/google/uuid"
	"golang.org/x/crypto/bcrypt"
	"gorm.io/gorm"
)

var (
	ErrEmailTaken      = errors.New("email already exists")
	ErrTrainerNotFound = errors.New("trainer not found")
)

type Service struct {
	repo *Repository
}

func NewService(repo *Repository) *Service {
	return &Service{repo: repo}
}

func (s *Service) ListTrainers(p pagination.Params, isActive *bool) ([]TrainerResponse, pagination.Meta, error) {
	trainers, total, err := s.repo.FindAll(p, isActive)
	if err != nil {
		return nil, pagination.Meta{}, err
	}

	return toTrainerResponses(trainers), pagination.BuildMeta(p, total), nil
}

func (s *Service) CreateTrainer(req CreateTrainerRequest) (*TrainerResponse, error) {
	existing, err := s.repo.FindByEmail(req.Email)
	if err == nil && existing != nil {
		return nil, ErrEmailTaken
	}
	if err != nil && !errors.Is(err, gorm.ErrRecordNotFound) {
		return nil, err
	}

	hashedPassword, err := bcrypt.GenerateFromPassword([]byte(req.Password), bcrypt.DefaultCost)
	if err != nil {
		return nil, err
	}

	user := &models.User{
		Email:        req.Email,
		Name:         req.Name,
		PasswordHash: string(hashedPassword),
		Role:         models.RoleTrainer,
	}

	trainer := &models.Trainer{
		Speciality: req.Speciality,
	}

	if err := s.repo.CreateTrainerWithUser(user, trainer); err != nil {
		return nil, err
	}

	resp := toTrainerResponse(trainer)
	return &resp, nil
}

func (s *Service) GetTrainer(id uuid.UUID) (*TrainerResponse, error) {
	trainer, err := s.repo.FindByID(id)
	if err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return nil, ErrTrainerNotFound
		}
		return nil, err
	}

	resp := toTrainerResponse(trainer)
	return &resp, nil
}

func (s *Service) UpdateTrainer(id uuid.UUID, req UpdateTrainerRequest) (*TrainerResponse, error) {
	trainer, err := s.repo.FindByID(id)
	if err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return nil, ErrTrainerNotFound
		}
		return nil, err
	}

	if req.Speciality != nil {
		trainer.Speciality = req.Speciality
	}

	log.Printf("---> IsActive value: %v", req)

	user := &trainer.User
	if req.Name != nil {
		user.Name = *req.Name
	}
	if req.IsActive != nil {
		user.IsActive = *req.IsActive
	}

	log.Printf("---> IsActive value after update: %v", user.IsActive)

	if err := s.repo.UpdateTrainerWithUser(trainer, user); err != nil {
		return nil, err
	}

	resp := toTrainerResponse(trainer)
	return &resp, nil
}

func (s *Service) DeleteTrainer(id uuid.UUID) error {
	trainer, err := s.repo.FindByID(id)
	if err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return ErrTrainerNotFound
		}
		return err
	}

	return s.repo.DeleteUser(trainer.UserID)
}
