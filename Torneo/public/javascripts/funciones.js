function add(){
    // let access_token = localStorage.getItem('access_token');
    // if(!access_token){
    //    alert('no guardo en el local storage');
    //    getToken();
    // }
    // else{
    //     if(!tokenIsValid())
    //     {
    //         getToken();
    //     }
    // }
    
    const url_cors = "https://cors-anywhere.herokuapp.com/";
    var url = url_cors+'https://api.softwareavanzado.world/index.php?webserviceClient=administrator&webserviceVersion=1.0.0&option=contact&api=hal';

    var req = new XMLHttpRequest();
    req.open("POST",url);
    req.setRequestHeader('Authorization', 'Bearer ' + access_token);
    req.setRequestHeader('Content-Type', 'application/json',true);
    
    var contac_name = document.getElementById('contact_name').value

    if(!contac_name)
    {
        alert('Por favor ingrese un nombre válido');
        return;
    }
    var text = JSON.stringify({"name":contac_name});
    var respuesta;
    
    req.onreadystatechange = function() {
        if(req.readyState == 4 && req.status == 201) { 
            //req.responseText;
            try{
                respuesta = JSON.parse(req.responseText);
                console.log("id: "+respuesta.id);
                document.getElementById('contact_name').value = ""
                alert('Contacto creado, con el id: '+respuesta.id)
            }catch(err){
                console.log(err);
            }
            return;
        }
        showHeaderMessage(req.status);
        
    }
    req.send(text);

}

function showHeaderMessage(status)
{
    switch(status)
    {
        case 400: alert('No se logró realizar la petición error 400, error del cliente'); return;
        case 404: alert('No se logró realizar la petición error 404, error del cliente'); return;
        case 405: alert('No se logró realizar la petición metodo no permitido 405'); return;
        case 406: alert('No se logró realizar la petición error 406, No aceptable'); return;
        case 500: alert('Error del servidor, 500'); return;
    }
}