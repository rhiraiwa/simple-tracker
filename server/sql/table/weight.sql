DROP TABLE SIMPLE_TRACKER.WEIGHT;

CREATE TABLE SIMPLE_TRACKER.WEIGHT (
  date               DATE          NOT NULL,
  time               tinyint       NOT NULL,
  weight             DOUBLE(5,2)   NOT NULL,
  bodyFatPercentage  DOUBLE(3,1)   
);

ALTER TABLE SIMPLE_TRACKER.WEIGHT ADD PRIMARY KEY (date);