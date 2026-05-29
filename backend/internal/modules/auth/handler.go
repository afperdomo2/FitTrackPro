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

func RegisterPublicRoutes(rg *gin.RouterGroup, h *Handler) {
	rg.POST("/auth/register", h.Register)
	rg.POST("/auth/login", h.Login)
}

func RegisterProtectedRoutes(rg *gin.RouterGroup, h *Handler) {
	rg.PUT("/auth/change-password", h.ChangePassword)
}

// Register godoc
//
//	@Summary		Registrar primer administrador
//	@Description	Crea el primer usuario administrador. Bloquea el registro si ya existe un administrador.
//	@Tags			auth
//	@Accept			json
//	@Produce		json
//	@Param			request	body		RegisterRequest	true	"Datos de registro"
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
//	@Summary		Iniciar sesión
//	@Description	Autentica un usuario y devuelve un token JWT. Si must_change_password es true, el usuario debe cambiar su contraseña.
//	@Tags			auth
//	@Accept			json
//	@Produce		json
//	@Param			request	body		LoginRequest	true	"Credenciales de acceso"
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

// ChangePassword godoc
//
//	@Summary		Cambiar contraseña
//	@Description	Cambia la contraseña del usuario autenticado. Establece must_change_password a false.
//	@Tags			auth
//	@Accept			json
//	@Produce		json
//	@Param			request	body		ChangePasswordRequest	true	"Contraseña actual y nueva"
//	@Success		200		{object}	response.APIResponse
//	@Failure		400		{object}	response.APIResponse
//	@Failure		401		{object}	response.APIResponse
//	@Security		BearerAuth
//	@Router			/auth/change-password [put]
func (h *Handler) ChangePassword(c *gin.Context) {
	userID, exists := c.Get("user_id")
	if !exists {
		response.Error(c, http.StatusUnauthorized, "User not authenticated")
		return
	}

	var req ChangePasswordRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		response.Error(c, http.StatusBadRequest, err.Error())
		return
	}

	if err := h.svc.ChangePassword(userID.(uint), req); err != nil {
		switch {
		case errors.Is(err, ErrInvalidOldPassword):
			response.Error(c, http.StatusUnauthorized, err.Error())
		default:
			response.Error(c, http.StatusInternalServerError, "Internal server error")
		}
		return
	}

	response.OK(c, gin.H{"message": "Password changed successfully"})
}
