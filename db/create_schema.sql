CREATE EXTENSION IF NOT EXISTS postgis;

DROP TABLE IF EXISTS track;

CREATE TABLE track (
  vessel_id TEXT,
  timestamp TIMESTAMP WITH TIME ZONE,
  point GEOGRAPHY(Point,4326) NOT NULL,
  PRIMARY KEY (vessel_id, timestamp)
)
