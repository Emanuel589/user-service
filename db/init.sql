CREATE TABLE test_user (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100),
  email VARCHAR(100) UNIQUE
);

INSERT INTO test_user (name, email)
VALUES ('Emanuel', 'emanuel@example.com');