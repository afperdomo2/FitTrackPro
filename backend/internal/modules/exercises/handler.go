package exercises

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
	exercises := rg.Group("/exercises")
	exercises.Use(middleware.RequireRole("trainer"))
	exercises.GET("", h.ListExercises)
	exercises.POST("", h.CreateExercise)
	exercises.GET("/:id", h.GetExercise)
	exercises.PUT("/:id", h.UpdateExercise)
	exercises.DELETE("/:id", h.DeleteExercise)
}

// ListExercises godoc
//
//	@Summary		Listar ejercicios (trainer)
//	@Description	Lista los ejercicios del entrenador autenticado
//	@Tags			exercises
//	@Produce		json
//	@Param			page		query		int		false	"Número de página"	default(1)
//	@Param			per_page	query		int		false	"Registros por página"	default(20)
//	@Param			is_active		query		bool	false	"Filtrar por estado activo"
//	@Param			search			query		string	false	"Buscar por nombre"
//	@Param			muscle_group	query		string	false	"Filtrar por grupo muscular"
//	@Security		BearerAuth
//	@Success		200				{object}	pagination.Response{data=[]ExerciseResponse}
//	@Failure		403				{object}	response.APIResponse
//	@Failure		500				{object}	response.APIResponse
//	@Router			/exercises [get]
func (h *Handler) ListExercises(c *gin.Context) {
	userID, _ := c.Get("user_id")
	params := pagination.ParseParams(c)

	var isActive *bool
	if v := c.Query("is_active"); v != "" {
		b, err := strconv.ParseBool(v)
		if err == nil {
			isActive = &b
		}
	}

	search := c.Query("search")
	muscleGroup := c.Query("muscle_group")

	exercises, meta, err := h.svc.ListExercises(params, isActive, userID.(uuid.UUID), search, muscleGroup)
	if err != nil {
		if errors.Is(err, ErrTrainerNotFound) {
			response.Error(c, http.StatusForbidden, err.Error())
		} else {
			response.Error(c, http.StatusInternalServerError, "Failed to list exercises: "+err.Error())
		}
		return
	}

	response.OK(c, pagination.NewResponse(exercises, meta))
}

// CreateExercise godoc
//
//	@Summary		Crear ejercicio (trainer)
//	@Description	Crea un nuevo ejercicio para el entrenador autenticado
//	@Tags			exercises
//	@Accept			json
//	@Produce		json
//	@Param			request	body		CreateExerciseRequest	true	"Datos del ejercicio"
//	@Security		BearerAuth
//	@Success		201		{object}	response.APIResponse{data=ExerciseResponse}
//	@Failure		400		{object}	response.APIResponse
//	@Failure		403		{object}	response.APIResponse
//	@Failure		500		{object}	response.APIResponse
//	@Router			/exercises [post]
func (h *Handler) CreateExercise(c *gin.Context) {
	userID, _ := c.Get("user_id")

	var req CreateExerciseRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		response.Error(c, http.StatusBadRequest, err.Error())
		return
	}

	exercise, err := h.svc.CreateExercise(req, userID.(uuid.UUID))
	if err != nil {
		if errors.Is(err, ErrTrainerNotFound) {
			response.Error(c, http.StatusForbidden, err.Error())
		} else {
			response.Error(c, http.StatusInternalServerError, "Internal server error")
		}
		return
	}

	response.Created(c, exercise)
}

// GetExercise godoc
//
//	@Summary		Obtener ejercicio (trainer)
//	@Description	Devuelve un ejercicio del entrenador autenticado
//	@Tags			exercises
//	@Produce		json
//	@Param			id	path		string	true	"ID del ejercicio"
//	@Security		BearerAuth
//	@Success		200	{object}	response.APIResponse{data=ExerciseResponse}
//	@Failure		403	{object}	response.APIResponse
//	@Failure		404	{object}	response.APIResponse
//	@Router			/exercises/{id} [get]
func (h *Handler) GetExercise(c *gin.Context) {
	userID, _ := c.Get("user_id")

	id, err := uuid.Parse(c.Param("id"))
	if err != nil {
		response.Error(c, http.StatusBadRequest, "Invalid exercise ID")
		return
	}

	exercise, err := h.svc.GetExercise(id, userID.(uuid.UUID))
	if err != nil {
		switch {
		case errors.Is(err, ErrExerciseNotFound):
			response.Error(c, http.StatusNotFound, err.Error())
		case errors.Is(err, ErrTrainerNotFound):
			response.Error(c, http.StatusForbidden, err.Error())
		default:
			response.Error(c, http.StatusInternalServerError, "Failed to get exercise")
		}
		return
	}

	response.OK(c, exercise)
}

// UpdateExercise godoc
//
//	@Summary		Actualizar ejercicio (trainer)
//	@Description	Actualiza los datos del ejercicio
//	@Tags			exercises
//	@Accept			json
//	@Produce		json
//	@Param			id		path		string					true	"ID del ejercicio"
//	@Param			request	body		UpdateExerciseRequest	true	"Datos a actualizar"
//	@Security		BearerAuth
//	@Success		200		{object}	response.APIResponse{data=ExerciseResponse}
//	@Failure		400		{object}	response.APIResponse
//	@Failure		403		{object}	response.APIResponse
//	@Failure		404		{object}	response.APIResponse
//	@Failure		500		{object}	response.APIResponse
//	@Router			/exercises/{id} [put]
func (h *Handler) UpdateExercise(c *gin.Context) {
	userID, _ := c.Get("user_id")

	id, err := uuid.Parse(c.Param("id"))
	if err != nil {
		response.Error(c, http.StatusBadRequest, "Invalid exercise ID")
		return
	}

	var req UpdateExerciseRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		response.Error(c, http.StatusBadRequest, err.Error())
		return
	}

	exercise, err := h.svc.UpdateExercise(id, req, userID.(uuid.UUID))
	if err != nil {
		switch {
		case errors.Is(err, ErrExerciseNotFound):
			response.Error(c, http.StatusNotFound, err.Error())
		case errors.Is(err, ErrTrainerNotFound):
			response.Error(c, http.StatusForbidden, err.Error())
		default:
			response.Error(c, http.StatusInternalServerError, "Failed to update exercise")
		}
		return
	}

	response.OK(c, exercise)
}

// DeleteExercise godoc
//
//	@Summary		Eliminar ejercicio (trainer)
//	@Description	Realiza borrado lógico del ejercicio
//	@Tags			exercises
//	@Produce		json
//	@Security		BearerAuth
//	@Success		200	{object}	response.APIResponse
//	@Failure		403	{object}	response.APIResponse
//	@Failure		404	{object}	response.APIResponse
//	@Router			/exercises/{id} [delete]
func (h *Handler) DeleteExercise(c *gin.Context) {
	userID, _ := c.Get("user_id")

	id, err := uuid.Parse(c.Param("id"))
	if err != nil {
		response.Error(c, http.StatusBadRequest, "Invalid exercise ID")
		return
	}

	if err := h.svc.DeleteExercise(id, userID.(uuid.UUID)); err != nil {
		switch {
		case errors.Is(err, ErrExerciseNotFound):
			response.Error(c, http.StatusNotFound, err.Error())
		case errors.Is(err, ErrTrainerNotFound):
			response.Error(c, http.StatusForbidden, err.Error())
		default:
			response.Error(c, http.StatusInternalServerError, "Failed to delete exercise")
		}
		return
	}

	response.OK(c, nil)
}
