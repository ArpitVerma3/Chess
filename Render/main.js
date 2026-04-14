import * as pieces from "../Data/pieces.js";
import { ROOT_DIV } from "../Helper/constants.js";
import { globalData } from "../index.js";

function globalStateRender(){
    globalData.forEach(row => {
        row.forEach((element)=> {
            const squareEl=document.getElementById(element.id);
            if (!squareEl) return;

            squareEl.innerHTML = "";

            if(element.isHighlighted){
                const highlightSpan = document.createElement("span");
                highlightSpan.classList.add("highlight");
                squareEl.appendChild(highlightSpan);
            }

            if(element.piece){
                const pieceEl=document.createElement("img");
                pieceEl.src = element.piece.img;
                pieceEl.classList.add("piece");
                squareEl.appendChild(pieceEl);
            }
        }) 
    });
}

function moveElement(piece,id){
    const flatData=globalData.flat();

    const from=flatData.find(el => el.id === piece.curr_pos);
    const to=flatData.find(el => el.id === id);
    if(!from || !to) return;

    to.piece=from.piece;
    to.piece.curr_pos=to.id;
    from.piece=null;

    piece.curr_pos=id;

    clearHighlight();
    globalStateRender();
}
// function move_piece_from_x_to_y(from,to){
//     to.piece=from.piece;
//     to.piece.curr_pos=from.id;

//     from.piece=null;
//     globalStateRender();
// }

function selfhlts(piece){
    document.getElementById(piece.curr_pos)
    .classList.add("hltYlow");
}
function clearPrevSelfHlt(piece){
    if(piece){
    document.getElementById(piece.curr_pos)
    .classList.remove("hltYlow");
    }
}
function pieceRender(data){

    data.forEach(row => {
        row.forEach(square => {

            //if suqre alrdy have piece :
            if(square.piece){
                const squareEl=document.getElementById(square.id);

                const pieceEl=document.createElement("img");
                pieceEl.src = square.piece.img;

                pieceEl.classList.add("piece");
                squareEl.appendChild(pieceEl);
            }
        });
    });
}
function initGameRender(data){

    data.forEach(element => {
        const rowEl=document.createElement("div");

        element.forEach(square => {
            const squareDiv=document.createElement("div");
            
            squareDiv.classList.add("square");
            squareDiv.classList.add(square.color);
            
            squareDiv.id=square.id;
            
            //black rook
            if(square.id=="h8" || square.id=="a8"){
                square.piece=pieces.blackRook(square.id);
            }
            //black knight
            if(square.id=="b8" || square.id=="g8"){
                square.piece=pieces.blackKnight(square.id);
            }
            //black bishop
            if(square.id=="c8" || square.id=="f8"){
                square.piece=pieces.blackBishop(square.id);
            }
            //black queen
            if(square.id=="d8"){
                square.piece=pieces.blackQueen(square.id);
            }
            //black king
            if(square.id=="e8"){
                square.piece=pieces.blackKing(square.id);
            }
            //black pawn
            if(square.id[1]==7){
                square.piece=pieces.blackPawn(square.id);
            }

             //white rook
            if(square.id=="a1" || square.id=="h1"){
                square.piece=pieces.whiteRook(square.id);
            }
            //white knight
            if(square.id=="b1" || square.id=="g1"){
                square.piece=pieces.whiteKnight(square.id);
            }
            //white bishop
            if(square.id=="c1" || square.id=="f1"){
                square.piece=pieces.whiteBishop(square.id);
            }
            //white queen
            if(square.id=="d1"){
                square.piece=pieces.whiteQueen(square.id);
            }
            //white king
            if(square.id=="e1"){
                square.piece=pieces.whiteKing(square.id);
            }
            //white pawn
            if(square.id[1]==2){
                square.piece=pieces.whitePawn(square.id);
            }
            
            rowEl.appendChild(squareDiv);
        });
        rowEl.classList.add("sqrRow");
        ROOT_DIV.appendChild(rowEl);
    });

    pieceRender(data);
} 

function clearHighlight(){
    globalData.flat().forEach(el => {
        el.isHighlighted=false;
        el.captureHighlight=false;
    });
    document.querySelectorAll(".highlight")
    .forEach((el) => el.remove());
    document.querySelectorAll(".captureColor").forEach((el) => el.classList.remove("captureColor"));
    globalStateRender();
}

function renderHighlight(squareId){
    const ids = Array.isArray(squareId) ? squareId : [squareId];
    ids.forEach(id => {
        const square = globalData.flat().find(el => el.id === id);
        if(!square) return;
        square.isHighlighted=true;
        const squareEl = document.getElementById(id);
        if(!squareEl) return;
        if(!squareEl.querySelector(".highlight")){
            const highlightSpan = document.createElement("span");
            highlightSpan.classList.add("highlight");
            squareEl.appendChild(highlightSpan);
        }
    });
}

export { initGameRender,moveElement,
    clearPrevSelfHlt, renderHighlight,
     clearHighlight ,selfhlts,globalStateRender
};