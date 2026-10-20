-- Initial IBVAP schema from backend/app/models. Apply with `supabase db push`.

-- Application traffic must use the server-side DATABASE_URL, never a browser key.


CREATE TABLE IF NOT EXISTS cameras (
	id SERIAL NOT NULL,
	camera_id VARCHAR NOT NULL,
	name VARCHAR NOT NULL,
	location VARCHAR,
	latitude FLOAT,
	longitude FLOAT,
	rtsp_url VARCHAR,
	resolution VARCHAR,
	fps INTEGER,
	camera_type VARCHAR,
	zone VARCHAR,
	status VARCHAR,
	night_vision BOOLEAN,
	onvif_support BOOLEAN,
	created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
	updated_at TIMESTAMP WITH TIME ZONE,
	PRIMARY KEY (id)
);

CREATE TABLE IF NOT EXISTS edge_nodes (
	id SERIAL NOT NULL,
	node_id VARCHAR,
	status VARCHAR,
	network_status VARCHAR,
	ai_status VARCHAR,
	pending_sync_count INTEGER,
	last_sync TIMESTAMP WITH TIME ZONE,
	metrics JSON,
	timestamp TIMESTAMP WITH TIME ZONE DEFAULT now(),
	PRIMARY KEY (id)
);

CREATE TABLE IF NOT EXISTS system_metrics (
	id SERIAL NOT NULL,
	metric_type VARCHAR,
	value FLOAT,
	unit VARCHAR,
	status VARCHAR,
	timestamp TIMESTAMP WITH TIME ZONE DEFAULT now(),
	PRIMARY KEY (id)
);

CREATE TABLE IF NOT EXISTS tracks (
	id SERIAL NOT NULL,
	tracking_id VARCHAR,
	object_type VARCHAR,
	first_seen TIMESTAMP WITH TIME ZONE,
	last_seen TIMESTAMP WITH TIME ZONE,
	cameras JSON,
	path JSON,
	zone_transitions JSON,
	status VARCHAR,
	PRIMARY KEY (id)
);

CREATE TABLE IF NOT EXISTS users (
	id SERIAL NOT NULL,
	username VARCHAR NOT NULL,
	email VARCHAR NOT NULL,
	hashed_password VARCHAR NOT NULL,
	full_name VARCHAR,
	role VARCHAR,
	is_active BOOLEAN,
	created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
	updated_at TIMESTAMP WITH TIME ZONE,
	PRIMARY KEY (id)
);

CREATE TABLE IF NOT EXISTS alerts (
	id SERIAL NOT NULL,
	alert_id VARCHAR,
	severity VARCHAR,
	type VARCHAR,
	camera_id INTEGER,
	object_type VARCHAR,
	tracking_id VARCHAR,
	confidence FLOAT,
	risk_score FLOAT,
	risk_factors JSON,
	status VARCHAR,
	assigned_to INTEGER,
	created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
	updated_at TIMESTAMP WITH TIME ZONE,
	PRIMARY KEY (id),
	FOREIGN KEY(camera_id) REFERENCES cameras (id),
	FOREIGN KEY(assigned_to) REFERENCES users (id)
);

CREATE TABLE IF NOT EXISTS anpr_reads (
	id SERIAL NOT NULL,
	camera_id INTEGER,
	plate_number VARCHAR,
	vehicle_type VARCHAR,
	confidence FLOAT,
	plate_image_path VARCHAR,
	vehicle_image_path VARCHAR,
	timestamp TIMESTAMP WITH TIME ZONE DEFAULT now(),
	PRIMARY KEY (id),
	FOREIGN KEY(camera_id) REFERENCES cameras (id)
);

CREATE TABLE IF NOT EXISTS audit_logs (
	id SERIAL NOT NULL,
	user_id INTEGER,
	username VARCHAR,
	action VARCHAR,
	resource_type VARCHAR,
	resource_id VARCHAR,
	details VARCHAR,
	ip_address VARCHAR,
	result VARCHAR,
	timestamp TIMESTAMP WITH TIME ZONE DEFAULT now(),
	PRIMARY KEY (id),
	FOREIGN KEY(user_id) REFERENCES users (id)
);

CREATE TABLE IF NOT EXISTS camera_health (
	id SERIAL NOT NULL,
	camera_id INTEGER,
	stream_status VARCHAR,
	fps_actual FLOAT,
	latency_ms INTEGER,
	signal_quality INTEGER,
	ai_status VARCHAR,
	health_score INTEGER,
	issues JSON,
	timestamp TIMESTAMP WITH TIME ZONE DEFAULT now(),
	PRIMARY KEY (id),
	FOREIGN KEY(camera_id) REFERENCES cameras (id)
);

CREATE TABLE IF NOT EXISTS detections (
	id SERIAL NOT NULL,
	camera_id INTEGER,
	object_type VARCHAR,
	tracking_id VARCHAR,
	confidence FLOAT,
	bbox_x FLOAT,
	bbox_y FLOAT,
	bbox_w FLOAT,
	bbox_h FLOAT,
	direction VARCHAR,
	speed FLOAT,
	zone VARCHAR,
	timestamp TIMESTAMP WITH TIME ZONE DEFAULT now(),
	PRIMARY KEY (id),
	FOREIGN KEY(camera_id) REFERENCES cameras (id)
);

CREATE TABLE IF NOT EXISTS incidents (
	id SERIAL NOT NULL,
	incident_id VARCHAR,
	severity VARCHAR,
	status VARCHAR,
	camera_ids JSON,
	location VARCHAR,
	trigger VARCHAR,
	risk_score FLOAT,
	evidence_ids JSON,
	related_alert_ids JSON,
	related_tracking_ids JSON,
	assigned_to INTEGER,
	notes JSON,
	timeline JSON,
	created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
	updated_at TIMESTAMP WITH TIME ZONE,
	PRIMARY KEY (id),
	FOREIGN KEY(assigned_to) REFERENCES users (id)
);

CREATE TABLE IF NOT EXISTS notifications (
	id SERIAL NOT NULL,
	user_id INTEGER,
	category VARCHAR,
	title VARCHAR,
	message VARCHAR,
	is_read BOOLEAN,
	created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
	PRIMARY KEY (id),
	FOREIGN KEY(user_id) REFERENCES users (id)
);

CREATE TABLE IF NOT EXISTS zones (
	id SERIAL NOT NULL,
	name VARCHAR,
	camera_id INTEGER,
	zone_type VARCHAR,
	coordinates JSON,
	allowed_direction VARCHAR,
	time_start TIME WITHOUT TIME ZONE,
	time_end TIME WITHOUT TIME ZONE,
	alert_severity VARCHAR,
	is_active BOOLEAN,
	created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
	PRIMARY KEY (id),
	FOREIGN KEY(camera_id) REFERENCES cameras (id)
);

CREATE TABLE IF NOT EXISTS evidence (
	id SERIAL NOT NULL,
	evidence_id VARCHAR,
	type VARCHAR,
	camera_id INTEGER,
	incident_id INTEGER,
	file_path VARCHAR,
	sha256_hash VARCHAR,
	metadata_json JSON,
	integrity_verified BOOLEAN,
	timestamp TIMESTAMP WITH TIME ZONE DEFAULT now(),
	PRIMARY KEY (id),
	FOREIGN KEY(camera_id) REFERENCES cameras (id),
	FOREIGN KEY(incident_id) REFERENCES incidents (id)
);

CREATE UNIQUE INDEX IF NOT EXISTS ix_cameras_camera_id ON cameras (camera_id);

CREATE INDEX IF NOT EXISTS ix_cameras_id ON cameras (id);

CREATE INDEX IF NOT EXISTS ix_cameras_status ON cameras (status);

CREATE INDEX IF NOT EXISTS ix_edge_nodes_id ON edge_nodes (id);

CREATE UNIQUE INDEX IF NOT EXISTS ix_edge_nodes_node_id ON edge_nodes (node_id);

CREATE INDEX IF NOT EXISTS ix_system_metrics_id ON system_metrics (id);

CREATE INDEX IF NOT EXISTS ix_tracks_id ON tracks (id);

CREATE UNIQUE INDEX IF NOT EXISTS ix_tracks_tracking_id ON tracks (tracking_id);

CREATE UNIQUE INDEX IF NOT EXISTS ix_users_email ON users (email);

CREATE INDEX IF NOT EXISTS ix_users_id ON users (id);

CREATE INDEX IF NOT EXISTS ix_users_is_active ON users (is_active);

CREATE INDEX IF NOT EXISTS ix_users_role ON users (role);

CREATE UNIQUE INDEX IF NOT EXISTS ix_users_username ON users (username);

CREATE UNIQUE INDEX IF NOT EXISTS ix_alerts_alert_id ON alerts (alert_id);

CREATE INDEX IF NOT EXISTS ix_alerts_camera_id ON alerts (camera_id);

CREATE INDEX IF NOT EXISTS ix_alerts_created_at ON alerts (created_at);

CREATE INDEX IF NOT EXISTS ix_alerts_id ON alerts (id);

CREATE INDEX IF NOT EXISTS ix_alerts_severity ON alerts (severity);

CREATE INDEX IF NOT EXISTS ix_alerts_status ON alerts (status);

CREATE INDEX IF NOT EXISTS ix_alerts_type ON alerts (type);

CREATE INDEX IF NOT EXISTS ix_anpr_reads_id ON anpr_reads (id);

CREATE INDEX IF NOT EXISTS ix_anpr_reads_plate_number ON anpr_reads (plate_number);

CREATE INDEX IF NOT EXISTS ix_audit_logs_id ON audit_logs (id);

CREATE INDEX IF NOT EXISTS ix_camera_health_camera_id ON camera_health (camera_id);

CREATE INDEX IF NOT EXISTS ix_camera_health_id ON camera_health (id);

CREATE INDEX IF NOT EXISTS ix_camera_health_timestamp ON camera_health (timestamp);

CREATE INDEX IF NOT EXISTS ix_detections_id ON detections (id);

CREATE INDEX IF NOT EXISTS ix_detections_tracking_id ON detections (tracking_id);

CREATE INDEX IF NOT EXISTS ix_incidents_created_at ON incidents (created_at);

CREATE INDEX IF NOT EXISTS ix_incidents_id ON incidents (id);

CREATE UNIQUE INDEX IF NOT EXISTS ix_incidents_incident_id ON incidents (incident_id);

CREATE INDEX IF NOT EXISTS ix_incidents_severity ON incidents (severity);

CREATE INDEX IF NOT EXISTS ix_incidents_status ON incidents (status);

CREATE INDEX IF NOT EXISTS ix_notifications_id ON notifications (id);

CREATE INDEX IF NOT EXISTS ix_zones_id ON zones (id);

CREATE UNIQUE INDEX IF NOT EXISTS ix_evidence_evidence_id ON evidence (evidence_id);

CREATE INDEX IF NOT EXISTS ix_evidence_id ON evidence (id);



-- The React app must use the FastAPI API, never public PostgREST access.
-- The API connects server-side as the database owner; anon/authenticated client roles are denied.
DO $$
DECLARE table_name text;
BEGIN
  FOR table_name IN
    SELECT tablename FROM pg_tables WHERE schemaname = 'public'
  LOOP
    EXECUTE format('ALTER TABLE public.%I ENABLE ROW LEVEL SECURITY', table_name);
  END LOOP;
END $$;

REVOKE ALL ON ALL TABLES IN SCHEMA public FROM anon, authenticated;
REVOKE ALL ON ALL SEQUENCES IN SCHEMA public FROM anon, authenticated;
ALTER DEFAULT PRIVILEGES IN SCHEMA public REVOKE ALL ON TABLES FROM anon, authenticated;
ALTER DEFAULT PRIVILEGES IN SCHEMA public REVOKE ALL ON SEQUENCES FROM anon, authenticated;
