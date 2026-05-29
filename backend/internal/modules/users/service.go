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
