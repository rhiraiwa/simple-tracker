DROP TABLE SIMPLE_TRACKER.USER;

CREATE TABLE SIMPLE_TRACKER.USER (
	id SMALLINT NOT NULL,
	name NVARCHAR(100) NOT NULL,
	password NVARCHAR(50) NOT NULL
);

ALTER TABLE SIMPLE_TRACKER.USER ADD PRIMARY KEY (id);