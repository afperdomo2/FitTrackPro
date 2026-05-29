package main

import (
	"log"

	"github.com/gin-gonic/gin"
	swaggerFiles "github.com/swaggo/files"
	ginSwagger "github.com/swaggo/gin-swagger"

	"github.com/felipe/FitTrackPro/backend/internal/config"
	"github.com/felipe/FitTrackPro/backend/internal/database"
	"github.com/felipe/FitTrackPro/backend/internal/modules/health"
	_ "github.com/felipe/FitTrackPro/backend/docs"
)

// @title           FitTrackPro API
// @version         1.0
// @description     API para seguimiento de fitness y entrenamiento personal.
// @contact.name    FitTrackPro
// @contact.email   support@fittrackpro.com

// @host            localhost:8080
// @BasePath        /api/v1

// @schemes         http https
func main() {
	cfg := config.Load()

	db, err := database.Connect(cfg.Database.DSN())
	if err != nil {
		log.Fatalf("Failed to connect to database: %v", err)
	}

	r := gin.Default()

	r.GET("/swagger/*any", ginSwagger.WrapHandler(swaggerFiles.Handler))

	api := r.Group("/api/v1")
	health.RegisterRoutes(api, health.NewHandler(db))

	log.Printf("Server starting on port %s", cfg.AppPort)
	if err := r.Run(":" + cfg.AppPort); err != nil {
		log.Fatalf("Failed to start server: %v", err)
	}
}
