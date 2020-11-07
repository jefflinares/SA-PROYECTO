use sa;

create table IF NOT EXISTS PARTIDA (
    id INT AUTO_INCREMENT PRIMARY KEY,
    id_partida TEXT(250) NOT NULL,
    id_jugador1 INT NOT NULL,    
    id_jugador2 INT NOT NULL,
    fecha_creacion DATETIME DEFAULT NULL,
    fecha_finalizado DATETIME DEFAULT NULL,
    se_jugo BOOLEAN DEFAULT false,
    marcador TEXT(10) 
)
ENGINE = INNODB;






