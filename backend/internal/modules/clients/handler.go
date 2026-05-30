package clients

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
	clients := rg.Group("/clients")
	clients.Use(middleware.RequireRole("trainer"))
	clients.GET("", h.ListClients)
	clients.POST("", h.CreateClient)
	clients.GET("/:id", h.GetClient)
	clients.PUT("/:id", h.UpdateClient)
	clients.DELETE("/:id", h.DeleteClient)
}

// ListClients godoc
//
//	@Summary		Listar clientes (trainer)
//	@Description	Lista los clientes del entrenador autenticado
//	@Tags			clients
//	@Produce		json
//	@Param			page		query		int		false	"Número de página"	default(1)
//	@Param			per_page	query		int		false	"Registros por página"	default(20)
//	@Param			is_active	query		bool	false	"Filtrar por estado activo"
//	@Security		BearerAuth
//	@Success		200			{object}	pagination.Response{data=[]ClientResponse}
//	@Failure		403			{object}	response.APIResponse
//	@Failure		500			{object}	response.APIResponse
//	@Router			/clients [get]
func (h *Handler) ListClients(c *gin.Context) {
	userID, _ := c.Get("user_id")
	params := pagination.ParseParams(c)

	var isActive *bool
	if v := c.Query("is_active"); v != "" {
		b, err := strconv.ParseBool(v)
		if err == nil {
			isActive = &b
		}
	}

	clients, meta, err := h.svc.ListClients(params, isActive, userID.(uuid.UUID))
	if err != nil {
		if errors.Is(err, ErrTrainerNotFound) {
			response.Error(c, http.StatusForbidden, err.Error())
		} else {
			response.Error(c, http.StatusInternalServerError, "Failed to list clients: "+err.Error())
		}
		return
	}

	c.JSON(http.StatusOK, pagination.NewResponse(clients, meta))
}

// CreateClient godoc
//
//	@Summary		Crear cliente (trainer)
//	@Description	Crea un usuario con rol client y su perfil de cliente
//	@Tags			clients
//	@Accept			json
//	@Produce		json
//	@Param			request	body		CreateClientRequest	true	"Datos del cliente"
//	@Security		BearerAuth
//	@Success		201		{object}	response.APIResponse{data=ClientResponse}
//	@Failure		400		{object}	response.APIResponse
//	@Failure		403		{object}	response.APIResponse
//	@Failure		409		{object}	response.APIResponse
//	@Failure		500		{object}	response.APIResponse
//	@Router			/clients [post]
func (h *Handler) CreateClient(c *gin.Context) {
	userID, _ := c.Get("user_id")

	var req CreateClientRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		response.Error(c, http.StatusBadRequest, err.Error())
		return
	}

	client, err := h.svc.CreateClient(req, userID.(uuid.UUID))
	if err != nil {
		switch {
		case errors.Is(err, ErrEmailTaken):
			response.Error(c, http.StatusConflict, err.Error())
		case errors.Is(err, ErrTrainerNotFound):
			response.Error(c, http.StatusForbidden, err.Error())
		default:
			response.Error(c, http.StatusInternalServerError, "Internal server error")
		}
		return
	}

	response.Created(c, client)
}

// GetClient godoc
//
//	@Summary		Obtener cliente (trainer)
//	@Description	Devuelve un cliente del entrenador autenticado
//	@Tags			clients
//	@Produce		json
//	@Param			id	path		string	true	"ID del cliente"
//	@Security		BearerAuth
//	@Success		200	{object}	response.APIResponse{data=ClientResponse}
//	@Failure		403	{object}	response.APIResponse
//	@Failure		404	{object}	response.APIResponse
//	@Router			/clients/{id} [get]
func (h *Handler) GetClient(c *gin.Context) {
	userID, _ := c.Get("user_id")

	id, err := uuid.Parse(c.Param("id"))
	if err != nil {
		response.Error(c, http.StatusBadRequest, "Invalid client ID")
		return
	}

	client, err := h.svc.GetClient(id, userID.(uuid.UUID))
	if err != nil {
		switch {
		case errors.Is(err, ErrClientNotFound):
			response.Error(c, http.StatusNotFound, err.Error())
		case errors.Is(err, ErrTrainerNotFound):
			response.Error(c, http.StatusForbidden, err.Error())
		default:
			response.Error(c, http.StatusInternalServerError, "Failed to get client")
		}
		return
	}

	response.OK(c, client)
}

// UpdateClient godoc
//
//	@Summary		Actualizar cliente (trainer)
//	@Description	Actualiza los datos del cliente y del usuario asociado
//	@Tags			clients
//	@Accept			json
//	@Produce		json
//	@Param			id		path		string					true	"ID del cliente"
//	@Param			request	body		UpdateClientRequest	true	"Datos a actualizar"
//	@Security		BearerAuth
//	@Success		200		{object}	response.APIResponse{data=ClientResponse}
//	@Failure		400		{object}	response.APIResponse
//	@Failure		403		{object}	response.APIResponse
//	@Failure		404		{object}	response.APIResponse
//	@Failure		500		{object}	response.APIResponse
//	@Router			/clients/{id} [put]
func (h *Handler) UpdateClient(c *gin.Context) {
	userID, _ := c.Get("user_id")

	id, err := uuid.Parse(c.Param("id"))
	if err != nil {
		response.Error(c, http.StatusBadRequest, "Invalid client ID")
		return
	}

	var req UpdateClientRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		response.Error(c, http.StatusBadRequest, err.Error())
		return
	}

	client, err := h.svc.UpdateClient(id, req, userID.(uuid.UUID))
	if err != nil {
		switch {
		case errors.Is(err, ErrClientNotFound):
			response.Error(c, http.StatusNotFound, err.Error())
		case errors.Is(err, ErrTrainerNotFound):
			response.Error(c, http.StatusForbidden, err.Error())
		default:
			response.Error(c, http.StatusInternalServerError, "Failed to update client")
		}
		return
	}

	response.OK(c, client)
}

// DeleteClient godoc
//
//	@Summary		Eliminar cliente (trainer)
//	@Description	Realiza borrado lógico del usuario asociado al cliente
//	@Tags			clients
//	@Produce		json
//	@Security		BearerAuth
//	@Success		204	"No Content"
//	@Failure		403	{object}	response.APIResponse
//	@Failure		404	{object}	response.APIResponse
//	@Router			/clients/{id} [delete]
func (h *Handler) DeleteClient(c *gin.Context) {
	userID, _ := c.Get("user_id")

	id, err := uuid.Parse(c.Param("id"))
	if err != nil {
		response.Error(c, http.StatusBadRequest, "Invalid client ID")
		return
	}

	if err := h.svc.DeleteClient(id, userID.(uuid.UUID)); err != nil {
		switch {
		case errors.Is(err, ErrClientNotFound):
			response.Error(c, http.StatusNotFound, err.Error())
		case errors.Is(err, ErrTrainerNotFound):
			response.Error(c, http.StatusForbidden, err.Error())
		default:
			response.Error(c, http.StatusInternalServerError, "Failed to delete client")
		}
		return
	}

	c.Status(http.StatusNoContent)
}
