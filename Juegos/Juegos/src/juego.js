const config = require('../config');
const axios = require('axios');
const lib = require('./lib');
const { getDate } = require('./lib');

//DEFINICIÓN DE LOS 5 PIRATAS
let piratas = 
    [
            "Rojo",
            "Amarillo",
            "Verde",
            "Azul",
            "Anaranjado"
    ];

const MONEDAS = 100;
const NUMERO_DADOS = 2;
const CASILLAS_TABLERO = 100;

function getPirata(){
    return piratas[Math.floor(Math.random() * 5)]; 
}

/**
 * Función para actualizar la posición del pirata.
 * @param {'Objeto del pirata a evaluar'} pirata 
 * @param {'Número de casillas por avanzar'} numero_casillas 
 */
function actualizarPosition(pirata, numero_casillas){
    let casilla_actual = pirata.casilla_actual;
    let siguiente_casilla = casilla_actual + numero_casillas;
    let simulacion_cadena = ""
    if(siguiente_casilla <= 50){
        simulacion_cadena = "Pirata " + pirata.pirata + " en Escenario de Tierra\n";
    }
    else{
        simulacion_cadena = "Pirata " +pirata.pirata + " en Escenario de mar.\n";
    }

    //APLICAR LAS REGLAS DEL JUEGO
    switch(siguiente_casilla){
        case 10: case 34: case 45: //Escenario de Tierra
        case 55: case 64: case 90: case 97: //Escenario de Mar
            //CASILLAS BONUS
            pirata.monedas += 50;
            pirata.casilla_actual = siguiente_casilla;
            simulacion_cadena += "Pirata " + pirata.pirata +" Recibe un bonus de +50 monedas, por avanzar a la casilla: "+siguiente_casilla+", del Escenario de "+ (siguiente_casilla <= 50 ? 'Tierra':'Mar')+".\n";
            break;
        case 5: case 23: case 48:
        case 51: case 58: case 93:
            //CASILLAS CON PERDIDA
            pirata.monedas = pirata.monedas - 10 < 0 ? 0 :pirata.monedas - 10;
            pirata.casilla_actual = siguiente_casilla;
            simulacion_cadena += "Pirata " + pirata.pirata +" Pierde 10 monedas, por avanzar a la casilla: "+siguiente_casilla+", del Escenario de del Escenario de "+ (siguiente_casilla <= 50 ? 'Tierra':'Mar')+".\n";
            break;
        case 22: //Escenario de Tierra
        case 65: //Escenario de Mar
            //CASILLAS LODO, O VIENTO EN CONTRA REGRESAN A UNA POSICIÓN
            pirata.casilla_actual = (siguiente_casilla <= 50 ? 9 : 47);
            simulacion_cadena += "Pirata " + pirata.pirata +" Ha caído en una casilla de "+(siguiente_casilla <= 50 ? 'Lodo: ' : 'Viento en contra: ') +siguiente_casilla+" del Escenario de "+ (siguiente_casilla <= 50 ? 'Tierra':'Mar')+", debe Regresar a la posición: "+pirata.casilla_actual+".\n";
            break;
        case 11: //Escenario de Tierra
        case 57: //Escenario de Mar
            //CASILLAS ATAJO O VIENTO A FAVOR AVANZAN A OTRA CASILLA
            pirata.casilla_actual = (siguiente_casilla <= 50 ? 20 : 63);
            simulacion_cadena += "Pirata " + pirata.pirata +" Ha llegado a una casilla de "+(siguiente_casilla <= 50 ? 'Atajo: ' : 'Viento a favor: ') + siguiente_casilla+" del Escenario de "+ (siguiente_casilla <= 50 ? 'Tierra':'Mar')+", avanza a la posición: "+pirata.casilla_actual+".\n";
            break;
        default:
            pirata.casilla_actual = siguiente_casilla;
            break;
    }
    lib.appendToLog(simulacion_cadena);
    console.log(simulacion_cadena);
}




/**
 * Función para simulación del juego Piratas en busca del tesoro
 * @param {'Token para poder solicitar los dados'} token 
 * @param {'Id del usuario 1'} id_usuario1 
 * @param {'Id del usuario 2'} id_usuario2 
 * @param {'Id de la partida que se simulará'} id_partida 
 */
async function simular(token, id_usuario1, id_usuario2, id_partida){
    //console.log('Inicio simulación Token: '+token);
    lib.appendToLog('--------------------------------INICIO SIMULACIÓN------------------------------\n');
    let pirata1 = { pirata: getPirata(), monedas: MONEDAS, casilla_actual: 0, usuario: 1, id_usuario: id_usuario1 };
    let pirata2 = { pirata: getPirata(), monedas: MONEDAS, casilla_actual: 0, usuario: 2, id_usuario: id_usuario2 };
    while(pirata1 == pirata2){
        pirata2 = { pirata: getPirata(), monedas: MONEDAS };
    }

    let turno = defTurno(pirata1.pirata, pirata2.pirata);
    let posicion_max = 0;
    let numero_casillas = 0;
    while(posicion_max < CASILLAS_TABLERO){
        //MIENTRAS NO HAYA GANADOR   
        lib.appendToLog("Empieza turno para: " + (turno == 1 ? ("Pirata "+pirata1.pirata) : ("Pirata "+pirata2.pirata)) +"\n" );
        let dados = await getDados(token);
        if(dados !== undefined){
            if(dados.length == NUMERO_DADOS){   
                
                numero_casillas = dados[0] + dados[1];
                if(turno == 1){
                    //TURNO PARA EL PIRATA 1
                    //console.log('Turno pirata 1',pirata1.pirata);
                    actualizarPosition(pirata1, numero_casillas);
                    turno = 2; 
                }
                else{
                    //TURNO PARA EL PIRATA 2
                    //console.log('Turno pirata 2',pirata1.pirata);
                    actualizarPosition(pirata2, numero_casillas);
                    turno = 1;
                }

                //Actualizar quien va a la cabeza
                posicion_max = pirata1.casilla_actual > pirata2.casilla_actual ? 
                                pirata1.casilla_actual : 
                                pirata2.casilla_actual ;
            }else{
                //ESTO SERÍA RARO
                lib.appendToLog('El servicio de Dados no retorno 2 dados, si no únicamente: '+dados.length+' dados.');
                console.log('El servicio de Dados no retorno 2 dados, si no únicamente: '+dados.length+' dados.');
            }
        }else{
            lib.appendToLog('No fue posible obtener los dados: ');
            console.log('No fue posible obtener los dados');
        }
    }
    //YA HUBO UN GANADOR
    let result = {
                    id_partida : id_partida,
                    ganador: pirata1.casilla_actual >= 100 ? pirata1 : pirata2,
                    perdedor: pirata1.casilla_actual >= 100 ? pirata2 : pirata1
                };
    lib.appendToLog("Felicidades Pirata "+result.ganador.pirata+" Has ganado!!\nFIN DEL JUEGO!!");
    console.log("Felicidades Pirata "+result.ganador.pirata+" Has ganado!!\nFIN DEL JUEGO!!");
    //sendResultToTournament(result);
    return result;
}


/**
 * Función que define que pirata va antes que el otro al tirara los dados dependiendo del color
 * @param {'Pirata 1'} p1 
 * @param {'Pirata 2'} p2 
 */
function defTurno(p1, p2){

    function getTurno(pirata, color){
        return pirata == color ? 1 : 2;
    }

    for (let index = 0; index < piratas.length; index++) {
        const pirata = piratas[index];
        if(p1 == pirata || p2 == pirata){
            return getTurno(p1, pirata);
        }
    }
}

/**
 * Funcion que retorna el arreglo con los dados que se obtuvieron del MS - Dados.
 * @param {'Recibe el token del Micro servicio de Juegos para tirar los dados'} token 
 */
async function getDados(token){
    let fecha_hora_peticion = getDate();
    //console.log('Token decodificado: ',lib.decode(token));
    let url = 'http://'+config.DADOS_SERVICE_HOST+":"+config.DADOS_SERVICE_PORT+"/tirar/"+String(NUMERO_DADOS);
    const options = {
        headers: {
            Authorization: `Bearer ${token}`
        }
    };

    let dados_response = [];//await lib.makeGetPetition(url, null, options);
    try {
        return new Promise((resolve, reject) => {
            axios.get(url , { headers: {"Authorization" : `Bearer ${token}`}} )
            .then(res => {
                //console.log("Respuesta: ",res.data);
                switch(res.status){
                    case 200:
                        dados_response = res.data.dados;
                        resolve(dados_response);
                        break;
                    case 400:
                        lib.appendToLog('[MS - JUEGOS] Simulación Fallo solictar datos Status 400 at: '+fecha_hora_peticion);
                        console.log("MS Juegos - 400 (MS Dados) ", res.data);
                        return null;
                    default:
                        lib.appendToLog('[MS - JUEGOS] Simulación Fallo solictar datos Status 40X at: '+fecha_hora_peticion);
                        console.log("MS Juegos - 400 (MS Dados) ", res.data);
                        return null;
                }
                
            })
            .catch((error) => {
                console.log(error);
                reject(error);
            });
        });
    } catch (error) {
        console.log('Catch: ',error);
    }
    
}

async function sendResultToTournament(resultado){
    let url = 'http://'+config.TORNEOS_SERVICE_HOST+":"+config.TORNEOS_SERVICE_PORT+"/partidas/"+resultado.id_partida;
    const options = {
        headers: {
            Authorization: `Bearer ${token}`
        }
    };
    const body = {
        marcador: [
            (resultado.ganador.usuario == 1 ? 100 : resultado.perdedor.casilla_actual),
            (resultado.ganador.usuario == 2 ? 100 : resultado.perdedor.casilla_actual),
        ]
    }
    try {
        axios.put(
            url, 
            body, 
            { 
                headers: {
                    "Content-Type": "application/json",
                    "Authorization" : `Bearer ${token}`
                }
            } 
            )
        .then(res => {
            //console.log("Respuesta: ",res.data);
            switch(res.status){
                case 201:
                    lib.appendToLog('[MS - JUEGOS] Simulación -> Torneos Actualizar partida servicio de Torneos Status 201 at: '+fecha_hora_peticion);
                    console.log('Partida ha sido actualizada en el MS - Torneos', res.data);
                    break;
                case 404:
                    lib.appendToLog('[MS - JUEGOS] Simulación -> Torneos partida no encontrada Statuys 404 at: '+fecha_hora_peticion);
                    console.log("MS Torneos - 404 Partida no encontrada", res.data);
                    break;
                case 406:
                    lib.appendToLog('[MS - JUEGOS] Simulación -> Torneos partida Parámetros no válidos Status 406 at: '+fecha_hora_peticion);
                    console.log("MS Torneos - 406 Parámetros no válidos", res.data);
                    break;
                default:
                    console.log(res.data);
            }
            
        })
        .catch((error) => {
            console.log(error);
        });
    } catch (error) {
        console.log('Error con el MS Torneos',error);        
    }
}


module.exports = {
    simular
};