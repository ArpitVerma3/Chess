import * as pieces from "../Data/pieces.js";
import { ROOT_DIV } from "../Helper/constants.js";
import { globalData } from "../index.js";

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

function renderHighlight(squareId){
    const highlightSpan=document.createElement("span");
    highlightSpan.classList.add("highlight");

    document.getElementById(squareId).appendChild(highlightSpan);
}
function clearHighlight(){
    globalData.forEach((row) => {
        row.forEach((element) => {

            if(element.id==row){
                element.highlight=true;
            }
        });
    });
}

export{initGameRender,renderHighlight};