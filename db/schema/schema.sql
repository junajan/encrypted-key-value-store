CREATE TABLE IF NOT EXISTS store
(
    id SERIAL PRIMARY KEY,
    key varchar(255) NOT NULL,
    value text NOT NULL,
    salt varchar(20) NOT NULL,
    "createdAt" timestamp without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);

-- should we add also an encryption algorithm used for encrypting the value?
CREATE UNIQUE INDEX key_index ON store (key);
