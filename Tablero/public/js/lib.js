const rows = 10;
const cols = 10;
const width_col = 100;
const heigh_row = 55;
const top_ = 240;
var boxes = [];
placeDiv(0, top_, "matrix");


function placeDiv(x_pos, y_pos, div_id) {
    var d = document.getElementById(div_id);
    d.style.position = "absolute";
    d.style.left = x_pos+'px';
    d.style.top = y_pos+'px';
    //createLogicMatrix(d);
    addRows();
}

function createRow(id) {
    let row = document.createElement('div');
    row.className = "row";
    row.id = "row_"+id;
    return row;
}

function createColumn(size,id) {
    let col = document.createElement('div');
    col.className = 'col-md-' + size;
    col.id = "col_"+id;
    return col;
}


function createH6(text){
    var h = document.createElement("h6");
    h.innerText=text;
}


function addRows() {
    let box_index = 0;
    var table = document.getElementById('table_matrix');
    for (var i = 1; i <= rows; i++) {
        var tr = document.createElement('tr');
        
        for (let j = 1; j <= cols; j++) {
            
            var cell1 = document.createElement('td');    
            cell1.id = "col_"+i+""+j;
            cell1.style.textAlign='center';
            cell1.style.width = '122px';
            cell1.style.height = '77px'
            //cell1.innerText=cell1.id;
            
            let img = document.createElement("img");

            let position = 0;
            if(j % 2 == 0){
                position = (j * cols) - (i-1);
            }
            else{
                position = ((j-1) * 10) + i;
            }

            cell1.appendChild(img);
            boxes.push(
                {
                    number: position,
                    cell: cell1,
                    img : img
                }
            );

            tr.appendChild(cell1);
        }
        table.appendChild(tr);
    }
}
let anteriores = [];
function putCoin_(){
    let new_pos = Number(document.getElementById("position_value").value);
    if(anteriores.length == 0)
        putCoin(new_pos, 0, "blue");
    else {
        putCoin(new_pos, anteriores[anteriores.length-1], "blue");
    }
}

function getBoxAt(pos){
    let b = null;
    for (let i = 0; i < boxes.length; i++) {
        if(boxes[i].number === pos){
            return boxes[i];
        }
        
    }
    return null;
}


function putCoin(newPosition, lastPosition,  color){
    // LIMPIAR EL ANTERIOR
    
    let b = getBoxAt(newPosition);
    
    
    if(lastPosition != 0){
        let b_last = getBoxAt(lastPosition);
        b_last.cell.innerHTML = "";
    }
    // PONER EL NUEVO
    if(b){
        let img = document.createElement("img");
        img.src = "../images/"+color+"_coin.png";
        b.cell.appendChild(img);
        b.img = img;
    }
    anteriores.push(newPosition);
    console.log("la ultima posición paso a ser: "+anteriores[anteriores.length-1])


}