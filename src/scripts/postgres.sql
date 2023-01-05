DROP TABLE IF EXISTS tb_hero;
DROP TABLE IF EXISTS tb_heroes;

CREATE TABLE tb_hero (
  ID int GENERATED ALWAYS AS IDENTITY PRIMARY KEY NOT NULL,
  NAME TEXT NOT NULL,
  POWER TEXT NOT NULL
);

--create
INSERT INTO tb_hero (NAME, POWER) 
VALUES
  ('Flash', 'Speed'),
  ('Batman', 'Money');

  --read
  SELECT * FROM tb_hero;
  SELECT * FROM tb_hero as h WHERE h.name='Flash' ORDER BY h.name ASC;

  --update
  UPDATE tb_hero SET name = 'Goku', power = 'God' WHERE id = 1;

  --delete
  DELETE FROM tb_hero WHERE id=1;