package main

import (
	"log"

	"github.com/gin-gonic/gin"
	swaggerFiles "github.com/swaggo/files"
	ginSwagger "github.com/swaggo/gin-swagger"

	"github.com/felipe/FitTrackPro/backend/internal/config"
	"github.com/felipe/FitTrackPro/backend/internal/database"
	"github.com/felipe/FitTrackPro/backend/internal/middleware"
	"github.com/felipe/FitTrackPro/backend/internal/models"
	"github.com/felipe/FitTrackPro/backend/internal/modules/auth"
	"github.com/felipe/FitTrackPro/backend/internal/modules/health"
	"github.com/felipe/FitTrackPro/backend/internal/modules/users"

	_ "github.com/felipe/FitTrackPro/backend/docs"
)

// @title           FitTrackPro API
// @version         1.0
// @description     API para seguimiento de fitness y entrenamiento personal.
// @contact.name    FitTrackPro
// @contact.email   support@fittrackpro.com

// @host            localhost:8080
// @BasePath        /api/v1

// @securityDefinitions.apikey BearerAuth
// @in header
// @name Authorization

// @schemes         http https
func main() {
	cfg := config.Load()

	db, err := database.Connect(cfg.Database.DSN())
	if err != nil {
		log.Fatalf("Failed to connect to database: %v", err)
	}

	if err := db.AutoMigrate(&models.User{}); err != nil {
		log.Fatalf("Failed to run migrations: %v", err)
	}

	r := gin.Default()

	r.GET("/swagger/*any", ginSwagger.WrapHandler(swaggerFiles.Handler))

	authHandler := auth.NewHandler(db, &cfg.JWT)
	usersHandler := users.NewHandler(db)

	public := r.Group("/api/v1")
	health.RegisterRoutes(public, health.NewHandler(db))
	auth.RegisterPublicRoutes(public, authHandler)

	protected := r.Group("/api/v1")
	protected.Use(middleware.AuthRequired(cfg.JWT.Secret))
	protected.Use(middleware.PasswordChangeRequired())
	users.RegisterRoutes(protected, usersHandler)

	passwordGroup := r.Group("/api/v1")
	passwordGroup.Use(middleware.AuthRequired(cfg.JWT.Secret))
	auth.RegisterProtectedRoutes(passwordGroup, authHandler)

	log.Printf("Server starting on port %s", cfg.AppPort)
	if err := r.Run(":" + cfg.AppPort); err != nil {
		log.Fatalf("Failed to start server: %v", err)
	}
}
