DROP TABLE SIMPLE_TRACKER.USER;

CREATE TABLE SIMPLE_TRACKER.USER (
	id 							SMALLINT NOT NULL,
	name 						NVARCHAR(100) NOT NULL,
	password 				NVARCHAR(50) NOT NULL,
	age							TINYINT,
	gender					TINYINT,
	height 					DOUBLE(4,1),
	activity_level	TINYINT,
	weight_goal   	DOUBLE(5,2),
  BFP_goal      	DOUBLE(3,1)
);

ALTER TABLE SIMPLE_TRACKER.USER ADD PRIMARY KEY (id);