-- Script para crear la tabla de encuestas en la base de datos
-- Ejecutar este script cuando esté listo para implementar la base de datos

CREATE TABLE IF NOT EXISTS surveys (
  id SERIAL PRIMARY KEY,
  survey_type VARCHAR(10) NOT NULL CHECK (survey_type IN ('entry', 'exit')),
  
  -- Campos para encuesta de entrada
  entry_reason VARCHAR(100),
  
  -- Campos para encuesta de salida
  exit_rating INTEGER CHECK (exit_rating >= 1 AND exit_rating <= 5),
  exit_feedback TEXT,
  
  -- Metadatos
  user_session VARCHAR(255),
  ip_address VARCHAR(45),
  user_agent TEXT,
  timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  
  -- Índices para consultas rápidas
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Índices para mejorar el rendimiento de consultas
CREATE INDEX idx_surveys_type ON surveys(survey_type);
CREATE INDEX idx_surveys_timestamp ON surveys(timestamp);
CREATE INDEX idx_surveys_rating ON surveys(exit_rating);

-- Vista para análisis de satisfacción
CREATE VIEW satisfaction_stats AS
SELECT 
  DATE(timestamp) as date,
  COUNT(*) as total_responses,
  AVG(exit_rating) as avg_rating,
  COUNT(CASE WHEN exit_rating >= 4 THEN 1 END) as positive_responses,
  COUNT(CASE WHEN exit_rating <= 2 THEN 1 END) as negative_responses
FROM surveys
WHERE survey_type = 'exit'
GROUP BY DATE(timestamp)
ORDER BY date DESC;

-- Vista para análisis de razones de entrada
CREATE VIEW entry_reasons_stats AS
SELECT 
  entry_reason,
  COUNT(*) as count,
  ROUND(COUNT(*) * 100.0 / SUM(COUNT(*)) OVER (), 2) as percentage
FROM surveys
WHERE survey_type = 'entry'
GROUP BY entry_reason
ORDER BY count DESC;
