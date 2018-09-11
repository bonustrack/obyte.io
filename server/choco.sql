CREATE TABLE last_known_mci (
  mci INT
);

CREATE TABLE messages (
  unit VARCHAR(44),
  message_index SMALLINT,
  unit_main_chain_index INT,
  unit_is_stable SMALLINT NOT NULL DEFAULT 0,
  unit_creation_date TIMESTAMP,
  unit_authors JSONB,
  app VARCHAR(30),
  payload_location TEXT,
  payload_hash VARCHAR(44),
  payload JSONB,
  payload_uri_hash VARCHAR(44),
  payload_uri VARCHAR(500),
  PRIMARY KEY(unit, message_index)
);

CREATE VIEW attestors AS
  SELECT unit_authors,
  COUNT(unit) AS count FROM messages
  WHERE app = 'attestation'
  GROUP BY unit_authors
  ORDER BY count DESC;

CREATE VIEW polls AS
  SELECT * FROM messages
  WHERE app = 'poll'
  ORDER BY unit_creation_date DESC;

CREATE VIEW votes AS
  SELECT
  DISTINCT jsonb_array_elements(unit_authors) AS author,
  unit,
  message_index,
  unit_creation_date,
  payload->'unit' AS poll_unit,
  payload->'choice' AS choice
  FROM messages
  WHERE app = 'vote'
  ORDER BY unit_creation_date DESC;
