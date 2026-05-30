package trainers

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
	trainers := rg.Group("/trainers")
	trainers.GET("", h.ListTrainers)
	trainers.GET("/:id", h.GetTrainer)

	mutations := rg.Group("/trainers")
	mutations.Use(middleware.RequireRole("admin"))
	mutations.POST("", h.CreateTrainer)
	mutations.PUT("/:id", h.UpdateTrainer)
	mutations.DELETE("/:id", h.DeleteTrainer)
}

// ListTrainers godoc
//
//	@Summary		Listar entrenadores
//	@Description	Lista entrenadores con paginación
//	@Tags			trainers
//	@Produce		json
//	@Param			page		query		int		false	"Número de página"	default(1)
//	@Param			per_page	query		int		false	"Registros por página"	default(20)
//	@Param			is_active	query		bool	false	"Filtrar por estado activo"
//	@Security		BearerAuth
//	@Success		200			{object}	pagination.Response{data=[]TrainerResponse}
//	@Failure		500			{object}	response.APIResponse
//	@Router			/trainers [get]
func (h *Handler) ListTrainers(c *gin.Context) {
	params := pagination.ParseParams(c)

	var isActive *bool
	if v := c.Query("is_active"); v != "" {
		b, err := strconv.ParseBool(v)
		if err == nil {
			isActive = &b
		}
	}

	trainers, meta, err := h.svc.ListTrainers(params, isActive)
	if err != nil {
		response.Error(c, http.StatusInternalServerError, "Failed to list trainers: "+err.Error())
		return
	}

	c.JSON(http.StatusOK, pagination.NewResponse(trainers, meta))
}

// CreateTrainer godoc
//
//	@Summary		Crear entrenador (admin)
//	@Description	Crea un usuario con rol trainer y su perfil de entrenador
//	@Tags			trainers
//	@Accept			json
//	@Produce		json
//	@Param			request	body		CreateTrainerRequest	true	"Datos del entrenador"
//	@Success		201		{object}	response.APIResponse{data=TrainerResponse}
//	@Failure		400		{object}	response.APIResponse
//	@Failure		409		{object}	response.APIResponse
//	@Failure		500		{object}	response.APIResponse
//	@Security		BearerAuth
//	@Router			/trainers [post]
func (h *Handler) CreateTrainer(c *gin.Context) {
	var req CreateTrainerRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		response.Error(c, http.StatusBadRequest, err.Error())
		return
	}

	trainer, err := h.svc.CreateTrainer(req)
	if err != nil {
		switch {
		case errors.Is(err, ErrEmailTaken):
			response.Error(c, http.StatusConflict, err.Error())
		default:
			response.Error(c, http.StatusInternalServerError, "Internal server error")
		}
		return
	}

	response.Created(c, trainer)
}

// GetTrainer godoc
//
//	@Summary		Obtener entrenador
//	@Description	Devuelve un entrenador por su ID
//	@Tags			trainers
//	@Produce		json
//	@Param			id	path		string	true	"ID del entrenador"
//	@Success		200	{object}	response.APIResponse{data=TrainerResponse}
//	@Failure		404	{object}	response.APIResponse
//	@Security		BearerAuth
//	@Router			/trainers/{id} [get]
func (h *Handler) GetTrainer(c *gin.Context) {
	id, err := uuid.Parse(c.Param("id"))
	if err != nil {
		response.Error(c, http.StatusBadRequest, "Invalid trainer ID")
		return
	}

	trainer, err := h.svc.GetTrainer(id)
	if err != nil {
		if errors.Is(err, ErrTrainerNotFound) {
			response.Error(c, http.StatusNotFound, err.Error())
		} else {
			response.Error(c, http.StatusInternalServerError, "Failed to get trainer")
		}
		return
	}

	response.OK(c, trainer)
}

// UpdateTrainer godoc
//
//	@Summary		Actualizar entrenador (admin)
//	@Description	Actualiza los datos del entrenador y del usuario asociado
//	@Tags			trainers
//	@Accept			json
//	@Produce		json
//	@Param			id		path		string					true	"ID del entrenador"
//	@Param			request	body		UpdateTrainerRequest	true	"Datos a actualizar"
//	@Success		200		{object}	response.APIResponse{data=TrainerResponse}
//	@Failure		400		{object}	response.APIResponse
//	@Failure		404		{object}	response.APIResponse
//	@Failure		500		{object}	response.APIResponse
//	@Security		BearerAuth
//	@Router			/trainers/{id} [put]
func (h *Handler) UpdateTrainer(c *gin.Context) {
	id, err := uuid.Parse(c.Param("id"))
	if err != nil {
		response.Error(c, http.StatusBadRequest, "Invalid trainer ID")
		return
	}

	var req UpdateTrainerRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		response.Error(c, http.StatusBadRequest, err.Error())
		return
	}

	trainer, err := h.svc.UpdateTrainer(id, req)
	if err != nil {
		switch {
		case errors.Is(err, ErrTrainerNotFound):
			response.Error(c, http.StatusNotFound, err.Error())
		default:
			response.Error(c, http.StatusInternalServerError, "Failed to update trainer")
		}
		return
	}

	response.OK(c, trainer)
}

// DeleteTrainer godoc
//
//	@Summary		Eliminar entrenador (admin)
//	@Description	Realiza borrado lógico del usuario asociado al entrenador
//	@Tags			trainers
//	@Produce		json
//	@Success		204	"No Content"
//	@Failure		404	{object}	response.APIResponse
//	@Security		BearerAuth
//	@Router			/trainers/{id} [delete]
func (h *Handler) DeleteTrainer(c *gin.Context) {
	id, err := uuid.Parse(c.Param("id"))
	if err != nil {
		response.Error(c, http.StatusBadRequest, "Invalid trainer ID")
		return
	}

	if err := h.svc.DeleteTrainer(id); err != nil {
		if errors.Is(err, ErrTrainerNotFound) {
			response.Error(c, http.StatusNotFound, err.Error())
		} else {
			response.Error(c, http.StatusInternalServerError, "Failed to delete trainer")
		}
		return
	}

	c.Status(http.StatusNoContent)
}
