package users

import (
	"errors"
	"net/http"
	"strconv"

	"github.com/gin-gonic/gin"
	"github.com/google/uuid"
	"gorm.io/gorm"

	"github.com/felipe/FitTrackPro/backend/internal/middleware"
	"github.com/felipe/FitTrackPro/backend/pkg/pagination"
	"github.com/felipe/FitTrackPro/backend/pkg/response"
)

type Handler struct {
	svc *Service
}

func NewHandler(db *gorm.DB) *Handler {
	repo := NewRepository(db)
	return &Handler{svc: NewService(repo)}
}

func RegisterRoutes(rg *gin.RouterGroup, h *Handler) {
	users := rg.Group("/users")
	users.Use(middleware.RequireRole("admin"))
	users.Use(middleware.PasswordChangeRequired())
	users.GET("", h.ListUsers)
	users.GET("/:id", h.GetUser)
	users.DELETE("/:id", h.DeleteUser)
}

// ListUsers godoc
//
//	@Summary		Listar usuarios (admin)
//	@Description	Lista usuarios con paginación
//	@Tags			users
//	@Produce		json
//	@Param			page		query		int		false	"Número de página"	default(1)
//	@Param			per_page	query		int		false	"Registros por página"	default(20)
//	@Param			is_active	query		bool	false	"Filtrar por estado activo"
//	@Security		BearerAuth
//	@Success		200			{object}	pagination.Response{data=[]UserResponse}
//	@Failure		500			{object}	response.APIResponse
//	@Router			/users [get]
func (h *Handler) ListUsers(c *gin.Context) {
	params := pagination.ParseParams(c)

	var isActive *bool
	if v := c.Query("is_active"); v != "" {
		b, err := strconv.ParseBool(v)
		if err == nil {
			isActive = &b
		}
	}

	users, meta, err := h.svc.ListUsers(params, isActive)
	if err != nil {
		response.Error(c, http.StatusInternalServerError, "Failed to list users: "+err.Error())
		return
	}

	c.JSON(http.StatusOK, pagination.NewResponse(users, meta))
}

// GetUser godoc
//
//	@Summary		Obtener usuario (admin)
//	@Description	Devuelve un usuario por su ID
//	@Tags			users
//	@Produce		json
//	@Param			id	path		int	true	"ID del usuario"
//	@Success		200	{object}	response.APIResponse{data=UserResponse}
//	@Failure		404	{object}	response.APIResponse
//	@Security		BearerAuth
//	@Router			/users/{id} [get]
func (h *Handler) GetUser(c *gin.Context) {
	id, err := uuid.Parse(c.Param("id"))
	if err != nil {
		response.Error(c, http.StatusBadRequest, "Invalid user ID")
		return
	}

	user, err := h.svc.GetUser(id)
	if err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			response.Error(c, http.StatusNotFound, "User not found")
		} else {
			response.Error(c, http.StatusInternalServerError, "Failed to get user")
		}
		return
	}

	response.OK(c, user)
}

// DeleteUser godoc
//
//	@Summary		Eliminar usuario (admin)
//	@Description	Realiza borrado lógico del usuario (establece la marca de eliminado)
//	@Tags			users
//	@Produce		json
//	@Param			id	path		int	true	"ID del usuario"
//	@Success		204	"No Content"
//	@Failure		404	{object}	response.APIResponse
//	@Security		BearerAuth
//	@Router			/users/{id} [delete]
func (h *Handler) DeleteUser(c *gin.Context) {
	id, err := uuid.Parse(c.Param("id"))
	if err != nil {
		response.Error(c, http.StatusBadRequest, "Invalid user ID")
		return
	}

	if err := h.svc.DeleteUser(id); err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			response.Error(c, http.StatusNotFound, "User not found")
		} else {
			response.Error(c, http.StatusInternalServerError, "Failed to delete user")
		}
		return
	}

	c.Status(http.StatusNoContent)
}
