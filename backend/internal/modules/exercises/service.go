package exercises

import (
	"errors"

	"github.com/felipe/FitTrackPro/backend/internal/models"
	"github.com/felipe/FitTrackPro/backend/pkg/pagination"
	"github.com/google/uuid"
	"gorm.io/gorm"
)

var (
	ErrExerciseNotFound = errors.New("exercise not found")
	ErrTrainerNotFound  = errors.New("trainer profile not found")
)

type Service struct {
	repo *Repository
}

func NewService(repo *Repository) *Service {
	return &Service{repo: repo}
}

func (s *Service) ListExercises(p pagination.Params, isActive *bool, userID uuid.UUID, search string, muscleGroup string) ([]ExerciseResponse, pagination.Meta, error) {
	trainer, err := s.repo.FindTrainerByUserID(userID)
	if err != nil {
		return nil, pagination.Meta{}, ErrTrainerNotFound
	}

	exercises, total, err := s.repo.FindAll(p, isActive, trainer.ID, search, muscleGroup)
	if err != nil {
		return nil, pagination.Meta{}, err
	}

	return toExerciseResponses(exercises), pagination.BuildMeta(p, total), nil
}

func (s *Service) CreateExercise(req CreateExerciseRequest, userID uuid.UUID) (*ExerciseResponse, error) {
	trainer, err := s.repo.FindTrainerByUserID(userID)
	if err != nil {
		return nil, ErrTrainerNotFound
	}

	exercise := &models.Exercise{
		Name:             req.Name,
		Description:      req.Description,
		MuscleGroup:      req.MuscleGroup,
		SecondaryMuscles: req.SecondaryMuscles,
		Equipment:        req.Equipment,
		VideoURL:         req.VideoURL,
		ImageURL:         req.ImageURL,
		IsActive:         true,
		TrainerID:        trainer.ID,
	}

	if err := s.repo.Create(exercise); err != nil {
		return nil, err
	}

	resp := toExerciseResponse(exercise)
	return &resp, nil
}

func (s *Service) GetExercise(id uuid.UUID, userID uuid.UUID) (*ExerciseResponse, error) {
	trainer, err := s.repo.FindTrainerByUserID(userID)
	if err != nil {
		return nil, ErrTrainerNotFound
	}

	exercise, err := s.repo.FindByID(id, trainer.ID)
	if err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return nil, ErrExerciseNotFound
		}
		return nil, err
	}

	resp := toExerciseResponse(exercise)
	return &resp, nil
}

func (s *Service) UpdateExercise(id uuid.UUID, req UpdateExerciseRequest, userID uuid.UUID) (*ExerciseResponse, error) {
	trainer, err := s.repo.FindTrainerByUserID(userID)
	if err != nil {
		return nil, ErrTrainerNotFound
	}

	exercise, err := s.repo.FindByID(id, trainer.ID)
	if err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return nil, ErrExerciseNotFound
		}
		return nil, err
	}

	if req.Name != nil {
		exercise.Name = *req.Name
	}
	exercise.Description = req.Description
	if req.MuscleGroup != nil {
		exercise.MuscleGroup = *req.MuscleGroup
	}
	if req.SecondaryMuscles != nil {
		exercise.SecondaryMuscles = req.SecondaryMuscles
	}
	exercise.Equipment = req.Equipment
	exercise.VideoURL = req.VideoURL
	exercise.ImageURL = req.ImageURL
	if req.IsActive != nil {
		exercise.IsActive = *req.IsActive
	}

	if err := s.repo.Update(exercise); err != nil {
		return nil, err
	}

	resp := toExerciseResponse(exercise)
	return &resp, nil
}

func (s *Service) DeleteExercise(id uuid.UUID, userID uuid.UUID) error {
	trainer, err := s.repo.FindTrainerByUserID(userID)
	if err != nil {
		return ErrTrainerNotFound
	}

	exercise, err := s.repo.FindByID(id, trainer.ID)
	if err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return ErrExerciseNotFound
		}
		return err
	}

	return s.repo.Delete(exercise)
}
