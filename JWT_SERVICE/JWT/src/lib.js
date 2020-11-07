const fs   = require('fs');


async function appendToLog(text){
    console.log('TExto: ', text);
    fs.appendFile( './src/files/log.txt', text, function(err){
        if ( err ) throw err;
        console.log('Escribio en el archivo '+ fs.readFileSync('./src/files/log.txt'));
    })
}
function getDate(){
    let ts = Date.now();
    let date_ob = new Date(ts);
    let date = date_ob.getDate();
    let month = date_ob.getMonth() + 1;
    let year = date_ob.getFullYear();
    let hours = date_ob.getHours() - 6;
    let minutes = date_ob.getMinutes();
    let seconds = date_ob.getSeconds();
  
    let fulldate=year + "-" + month + "-" + date + " " + hours + ":" + minutes + ":" + seconds;
    return fulldate
  }

module.exports = {
    appendToLog,
    getDate
};