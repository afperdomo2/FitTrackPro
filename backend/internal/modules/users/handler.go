package users

import (
	"net/http"

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
