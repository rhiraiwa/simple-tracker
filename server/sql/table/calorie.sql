DROP TABLE SIMPLE_TRACKER.CALORIE;

CREATE TABLE SIMPLE_TRACKER.CALORIE (
  date               DATETIME      NOT NULL,
  id                 int           NOT NULL,
  calorie            DOUBLE(6,2)   NOT NULL,
  protein            DOUBLE(5,2)       ,
  fat                DOUBLE(5,2)       ,
  carbohydrate       DOUBLE(5,2)       ,
  note               NVARCHAR(200)
);

ALTER TABLE SIMPLE_TRACKER.CALORIE ADD PRIMARY KEY (id);