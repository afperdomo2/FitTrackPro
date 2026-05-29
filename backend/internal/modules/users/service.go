package users

import (
	"github.com/felipe/FitTrackPro/backend/pkg/pagination"
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

func (s *Service) DeleteUser(id uint) error {
	_, err := s.repo.FindByID(id)
	if err != nil {
		return err
	}
	return s.repo.Delete(id)
}
