package health

import (
	"net/http"
	"time"

	"github.com/gin-gonic/gin"
	"gorm.io/gorm"

	"github.com/felipe/FitTrackPro/backend/pkg/response"
)

type Handler struct {
	svc *Service
}

func NewHandler(db *gorm.DB) *Handler {
	return &Handler{svc: NewService(db)}
}

// RegisterRoutes registers health check routes.
func RegisterRoutes(rg *gin.RouterGroup, h *Handler) {
	rg.GET("/health", h.HealthCheck)
}

// HealthCheck godoc
//
//	@Summary		Verificación de estado
//	@Description	Verifica que el servidor y la base de datos estén operativos
//	@Tags			health
//	@Produce		json
//	@Success		200	{object}	response.APIResponse{data=HealthResponse}
//	@Failure		503	{object}	response.APIResponse
//	@Router			/health [get]
func (h *Handler) HealthCheck(c *gin.Context) {
	dbStatus := "connected"
	if err := h.svc.Ping(); err != nil {
		dbStatus = "disconnected"
		response.Error(c, http.StatusServiceUnavailable, "Database unreachable: "+err.Error())
		return
	}

	response.OK(c, HealthResponse{
		Status:    "ok",
		Timestamp: time.Now().UTC().Format(time.RFC3339),
		Database:  dbStatus,
	})
}
