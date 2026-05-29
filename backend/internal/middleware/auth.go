package middleware

import (
	"net/http"
	"strings"

	"github.com/gin-gonic/gin"

	jwtpkg "github.com/felipe/FitTrackPro/backend/pkg/jwt"
	"github.com/felipe/FitTrackPro/backend/pkg/response"
)

func AuthRequired(secret string) gin.HandlerFunc {
	return func(c *gin.Context) {
		authHeader := c.GetHeader("Authorization")
		if authHeader == "" {
			response.Error(c, http.StatusUnauthorized, "Authorization header required")
			c.Abort()
			return
		}

		parts := strings.SplitN(authHeader, " ", 2)
		if len(parts) != 2 || !strings.EqualFold(parts[0], "Bearer") {
			response.Error(c, http.StatusUnauthorized, "Invalid authorization format")
			c.Abort()
			return
		}

		claims, err := jwtpkg.ParseToken(parts[1], secret)
		if err != nil {
			switch {
			case err == jwtpkg.ErrExpiredToken:
				response.Error(c, http.StatusUnauthorized, "Token expired")
			default:
				response.Error(c, http.StatusUnauthorized, "Invalid token")
			}
			c.Abort()
			return
		}

		c.Set("user_id", claims.UserID)
		c.Set("email", claims.Email)
		c.Set("role", claims.Role)
		c.Next()
	}
}
