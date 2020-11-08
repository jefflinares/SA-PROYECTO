var express = require('express');
var router = express.Router();
var regex = require('regex');
var fs = require('fs');
const validator = require('validator');
const axios = require('../node_modules/axios');
const lib = require('../src/lib');
const path = require('path');
var db = require('./db.js');
const config = require('../config');
var archivo;
var now = new Date();
var token;

async function creacionTorneos(){
    let usuarios = await getUsers();
    var totalUsuarios = usuarios.length;
    if(totalUsuarios>0){
        var cantidadLlaves = totalUsuarios / 2;
        var cantidadRondas = totalRondas(totalUsuarios);
        var jugador1 = 0;
        var jugador2 = 0;

        
    }

    
}

async function getUsers(){

    if(token==undefined){
        token = await lib.getToken();
    }
    var url = "http://"+config.USERS_SERVICE_HOST+":"+config.USERS_SERVICE_PORT+"/jugadores";

    let partida_response;//await lib.makeGetPetition(url, null, options);
    try { 
            return new Promise((resolve, reject) => {
                axios.get(url , { headers: {"Authorization" : `Bearer ${token}`}} )
                .then(resAxios => {
                    //console.log("Respuesta: ",res.data);
                    switch(resAxios.status){
                        case 200:
                            archivo += "[TORNEOS]: MS-USUARIOS (200) LISTADO DE USUARIOS | " + now.toLocaleTimeString();
                            resolve(resAxios.data);
                            break;
                        case 406:
                            console.log("[TORNEOS]: MS-USUARIOS (406) Parámetros inválidos ", resAxios.data);
                            reject(resAxios.data);
                            return;
                        default:
                            console.log("[TORNEOS]: MS-USUARIOS (406) ERROR", resAxios.data);
                            reject(resAxios.data);
                            return;
                    } 
                })
                .catch((error) => {
                    console.log(error);
                });
            });

    } catch (error) {
        console.log('Catch: ',error);
    } 
}

//devuelve el id de un jugador random
function jugadorRandom(total){
    var t = Number(total);
    var aleatorio = Math.round(Math.random()*t);
    return aleatorio;
}

//Devuelve el id de un juego random
function juegoRandom(total){
    var t = Number(total);
    var aleatorio = Math.round(Math.random()*t);
    return aleatorio;
}

//calcula el total de rondas en base a la cantidad de jugadores
function totalRondas(totalUsuarios){
    var rondas = 0;
    var llaves = 0;
    var i = 0;
    llaves = totalUsuarios;
    while(i!=1){
        llaves = Number(llaves)/2;
        if(llaves!=1){
            rondas++;
        } else if(llaves<1){
            return rondas;
        }
    }
    return rondas;
}

function escribirLog(){
    let actual = fs.readFileSync("torneosLog.txt").toString();
    //console.log("actual: "+actual);
    fs.writeFileSync("torneosLog.txt", actual+archivo, "");
}

