CREATE DATABASE BDTORNEOS;

USE BDTORNEOS;

CREATE TABLE BDTORNEOS.JUEGOS(
ID INTEGER NOT NULL AUTO_INCREMENT,
NOMBRE VARCHAR(50),
IP VARCHAR(20),
PRIMARY KEY(ID)
);

CREATE TABLE BDTORNEOS.TORNEOS(
ID INTEGER NOT NULL AUTO_INCREMENT,
NOMBRE VARCHAR(50),
FECHA TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
PRIMARY KEY(ID)
);

CREATE TABLE BDTORNEOS.PARTIDAS(
ID INTEGER NOT NULL AUTO_INCREMENT,
UUID VARCHAR(200), 
JUGADOR1 VARCHAR(20),
JUGADOR2 VARCHAR(20),
IP_JUEGO VARCHAR(20),
ESTADO VARCHAR(2),
GANADOR VARCHAR(10),
ID_TORNEO INTEGER NOT NULL,
RONDA INTEGER,
FECHA_CREACION TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
FECHA_JUGADO TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
PRIMARY KEY(ID),
FOREIGN KEY (ID_TORNEO) REFERENCES BDTORNEOS.TORNEOS(ID)
);

ALTER USER 'root'@'localhost' IDENTIFIED WITH mysql_native_password BY 'admin';
INSERT INTO BDTORNEOS.PARTIDAS(UUID, JUGADOR1, JUGADOR2,IP_JUEGO, ESTADO, GANADOR, ID_TORNEO, RONDA) 
VALUES('e293e81e-20a2-11eb-adc1-0242ac120002', '1', '2', '192.168.1.1','00', '','1','1');
SELECT * FROM bdtorneos.JUEGOS;
SELECT * FROM bdtorneos.torneos;
SELECT * FROM BDTORNEOS.PARTIDAS;
SELECT COUNT(*) AS TOTAL FROM JUEGOS;
SELECT ID FROM JUEGOS WHERE NOMBRE = "PIRATAS";
SELECT ID FROM BDTORNEOS.JUEGOS WHERE NOMBRE = "PIRATAS DEL CARIBE";

DROP TABLE JUEGOS;
DROP TABLE PARTIDAS;
DROP TABLE TORNEOS;
INSERT INTO JUEGOS(NOMBRE, IP) VALUES("PIRATAS DEL CARIBE", "192.168.1.1");