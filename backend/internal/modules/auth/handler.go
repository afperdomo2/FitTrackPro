package auth

import (
	"errors"
	"net/http"

	"github.com/gin-gonic/gin"
	"gorm.io/gorm"

	"github.com/felipe/FitTrackPro/backend/internal/config"
	"github.com/felipe/FitTrackPro/backend/pkg/response"
)

type Handler struct {
	svc    *Service
	jwtCfg *config.JWTConfig
}

func NewHandler(db *gorm.DB, jwtCfg *config.JWTConfig) *Handler {
	repo := NewRepository(db)
	return &Handler{svc: NewService(repo), jwtCfg: jwtCfg}
}

func RegisterRoutes(rg *gin.RouterGroup, h *Handler) {
	rg.POST("/auth/register", h.Register)
	rg.POST("/auth/login", h.Login)
}

// Register godoc
//
//	@Summary		Register first admin
//	@Description	Creates the first admin user. Blocks if an admin already exists.
//	@Tags			auth
//	@Accept			json
//	@Produce		json
//	@Param			request	body		RegisterRequest	true	"Registration data"
//	@Success		201		{object}	response.APIResponse
//	@Failure		400		{object}	response.APIResponse
//	@Failure		409		{object}	response.APIResponse
//	@Router			/auth/register [post]
func (h *Handler) Register(c *gin.Context) {
	var req RegisterRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		response.Error(c, http.StatusBadRequest, err.Error())
		return
	}

	user, err := h.svc.Register(req)
	if err != nil {
		switch {
		case errors.Is(err, ErrAdminExists):
			response.Error(c, http.StatusConflict, err.Error())
		case errors.Is(err, ErrEmailTaken):
			response.Error(c, http.StatusConflict, err.Error())
		default:
			response.Error(c, http.StatusInternalServerError, "Internal server error")
		}
		return
	}

	response.Created(c, user)
}

// Login godoc
//
//	@Summary		Login
//	@Description	Authenticates a user and returns a JWT token.
//	@Tags			auth
//	@Accept			json
//	@Produce		json
//	@Param			request	body		LoginRequest	true	"Login credentials"
//	@Success		200		{object}	response.APIResponse{data=LoginResponse}
//	@Failure		400		{object}	response.APIResponse
//	@Failure		401		{object}	response.APIResponse
//	@Router			/auth/login [post]
func (h *Handler) Login(c *gin.Context) {
	var req LoginRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		response.Error(c, http.StatusBadRequest, err.Error())
		return
	}

	loginResp, err := h.svc.Login(req, h.jwtCfg.Secret, h.jwtCfg.ExpirationHours)
	if err != nil {
		if errors.Is(err, ErrInvalidCredentials) {
			response.Error(c, http.StatusUnauthorized, err.Error())
		} else {
			response.Error(c, http.StatusInternalServerError, "Internal server error")
		}
		return
	}

	response.OK(c, loginResp)
}
