package users

import (
	"errors"
	"net/http"
	"strconv"

	"github.com/gin-gonic/gin"
	"gorm.io/gorm"

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
	rg.GET("/users", h.ListUsers)
	rg.GET("/users/:id", h.GetUser)
	rg.DELETE("/users/:id", h.DeleteUser)
}

// ListUsers godoc
//
//	@Summary		Listar usuarios
//	@Description	Lista usuarios con paginación
//	@Tags			users
//	@Produce		json
//	@Param			page		query		int		false	"Número de página"	default(1)
//	@Param			per_page	query		int		false	"Registros por página"	default(20)
//	@Security		BearerAuth
//	@Success		200			{object}	pagination.Response{data=[]UserResponse}
//	@Failure		500			{object}	response.APIResponse
//	@Router			/users [get]
func (h *Handler) ListUsers(c *gin.Context) {
	params := pagination.ParseParams(c)

	users, meta, err := h.svc.ListUsers(params)
	if err != nil {
		response.Error(c, http.StatusInternalServerError, "Failed to list users: "+err.Error())
		return
	}

	c.JSON(http.StatusOK, pagination.NewResponse(users, meta))
}

// GetUser godoc
//
//	@Summary		Obtener usuario
//	@Description	Devuelve un usuario por su ID
//	@Tags			users
//	@Produce		json
//	@Param			id	path		int	true	"ID del usuario"
//	@Success		200	{object}	response.APIResponse{data=UserResponse}
//	@Failure		404	{object}	response.APIResponse
//	@Security		BearerAuth
//	@Router			/users/{id} [get]
func (h *Handler) GetUser(c *gin.Context) {
	id, err := strconv.ParseUint(c.Param("id"), 10, 64)
	if err != nil {
		response.Error(c, http.StatusBadRequest, "Invalid user ID")
		return
	}

	user, err := h.svc.GetUser(uint(id))
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
//	@Summary		Eliminar usuario
//	@Description	Realiza borrado lógico del usuario (establece la marca de eliminado)
//	@Tags			users
//	@Produce		json
//	@Param			id	path		int	true	"ID del usuario"
//	@Success		204	"No Content"
//	@Failure		404	{object}	response.APIResponse
//	@Security		BearerAuth
//	@Router			/users/{id} [delete]
func (h *Handler) DeleteUser(c *gin.Context) {
	id, err := strconv.ParseUint(c.Param("id"), 10, 64)
	if err != nil {
		response.Error(c, http.StatusBadRequest, "Invalid user ID")
		return
	}

	if err := h.svc.DeleteUser(uint(id)); err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			response.Error(c, http.StatusNotFound, "User not found")
		} else {
			response.Error(c, http.StatusInternalServerError, "Failed to delete user")
		}
		return
	}

	c.Status(http.StatusNoContent)
}
