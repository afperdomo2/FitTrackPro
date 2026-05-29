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
	svc             *Service
	defaultPassword string
}

func NewHandler(db *gorm.DB, defaultPassword string) *Handler {
	repo := NewRepository(db)
	return &Handler{svc: NewService(repo), defaultPassword: defaultPassword}
}

func RegisterRoutes(rg *gin.RouterGroup, h *Handler) {
	rg.GET("/users", h.ListUsers)
	rg.POST("/users", h.CreateUser)
	rg.GET("/users/:id", h.GetUser)
	rg.PUT("/users/:id", h.UpdateUser)
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

// CreateUser godoc
//
//	@Summary		Crear usuario
//	@Description	Crea un nuevo usuario con contraseña por defecto. El usuario deberá cambiar su contraseña al iniciar sesión.
//	@Tags			users
//	@Accept			json
//	@Produce		json
//	@Param			request	body		CreateUserRequest	true	"Datos del usuario"
//	@Success		201		{object}	response.APIResponse{data=UserResponse}
//	@Failure		400		{object}	response.APIResponse
//	@Failure		409		{object}	response.APIResponse
//	@Router			/users [post]
func (h *Handler) CreateUser(c *gin.Context) {
	var req CreateUserRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		response.Error(c, http.StatusBadRequest, err.Error())
		return
	}

	user, err := h.svc.CreateUser(req, h.defaultPassword)
	if err != nil {
		if errors.Is(err, ErrEmailTaken) {
			response.Error(c, http.StatusConflict, err.Error())
		} else {
			response.Error(c, http.StatusInternalServerError, "Failed to create user: "+err.Error())
		}
		return
	}

	response.Created(c, user)
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

// UpdateUser godoc
//
//	@Summary		Actualizar usuario
//	@Description	Actualiza el nombre de un usuario existente
//	@Tags			users
//	@Accept			json
//	@Produce		json
//	@Param			id		path		int					true	"ID del usuario"
//	@Param			request	body		UpdateUserRequest	true	"Nuevo nombre"
//	@Success		200		{object}	response.APIResponse{data=UserResponse}
//	@Failure		400		{object}	response.APIResponse
//	@Failure		404		{object}	response.APIResponse
//	@Router			/users/{id} [put]
func (h *Handler) UpdateUser(c *gin.Context) {
	id, err := strconv.ParseUint(c.Param("id"), 10, 64)
	if err != nil {
		response.Error(c, http.StatusBadRequest, "Invalid user ID")
		return
	}

	var req UpdateUserRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		response.Error(c, http.StatusBadRequest, err.Error())
		return
	}

	user, err := h.svc.UpdateUser(uint(id), req)
	if err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			response.Error(c, http.StatusNotFound, "User not found")
		} else {
			response.Error(c, http.StatusInternalServerError, "Failed to update user")
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
