use sa;

create table IF NOT EXISTS servicio (
    id_servicio int AUTO_INCREMENT PRIMARY KEY,
    id VARCHAR(50),
    pass VARCHAR(50),
    methods TEXT
)
ENGINE = INNODB;
;





