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
//	@Summary		List users
//	@Description	Lista usuarios con paginación
//	@Tags			users
//	@Produce		json
//	@Param			page		query		int		false	"Page number"	default(1)
//	@Param			per_page	query		int		false	"Items per page"	default(20)
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
//	@Summary		Create user
//	@Description	Creates a new user with a default password. User must change password on first login.
//	@Tags			users
//	@Accept			json
//	@Produce		json
//	@Param			request	body		CreateUserRequest	true	"User data"
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
//	@Summary		Get user by ID
//	@Description	Returns a single user by ID
//	@Tags			users
//	@Produce		json
//	@Param			id	path		int	true	"User ID"
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
//	@Summary		Update user
//	@Description	Updates the name of an existing user
//	@Tags			users
//	@Accept			json
//	@Produce		json
//	@Param			id		path		int					true	"User ID"
//	@Param			request	body		UpdateUserRequest	true	"Updated name"
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
//	@Summary		Delete user
//	@Description	Soft-deletes a user (sets deleted_at timestamp)
//	@Tags			users
//	@Produce		json
//	@Param			id	path		int	true	"User ID"
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
