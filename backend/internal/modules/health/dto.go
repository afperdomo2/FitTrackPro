package health

type HealthResponse struct {
	Status    string `json:"status" example:"ok"`
	Timestamp string `json:"timestamp" example:"2025-01-01T00:00:00Z"`
	Database  string `json:"database" example:"connected"`
}
