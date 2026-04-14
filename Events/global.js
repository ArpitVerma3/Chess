import { ROOT_DIV } from "../Helper/constants.js";
import { globalData } from "../index.js";
import { renderHighlight } from "../Render/main.js";
import { clearHighlight,moveElement } from "../Render/main.js";
import { selfhlts,clearPrevSelfHlt,globalStateRender } from "../Render/main.js";
import { checkOpponentPiece } from "../Helper/helpr1.js";

let selfhighlight=null;
let highlightState=false;
//move state
let moveState=null;

function clearHighlightLocal(){
    clearHighlight();
    highlightState=false;
}
function move_piece_from_x_to_y(from,to){
    to.piece=from.piece;
    from.piece=null;
    globalStateRender();
}
function whitePawnClicked({piece}){
    // globalStateRender();
    if(highlightState)return;

    if (selfhighlight === piece) {
        clearHighlight();
        clearPrevSelfHlt(selfhighlight);
        selfhighlight=null;
        moveState=null;
        return;
    }

    clearPrevSelfHlt(selfhighlight);
    clearHighlight();
    selfhlts(piece);

    selfhighlight=piece;

    moveState=piece;

    const curr_posi=piece.curr_pos;

    if(curr_posi[1]=="2"){
        const hltsSqrIds=[
            `${curr_posi[0]}${Number(curr_posi[1]) + 1}`,
            `${curr_posi[0]}${Number(curr_posi[1]) + 2}`,
        ];

        hltsSqrIds.forEach((highlight) => {

            globalData.forEach((row) => {
                row.forEach((element) => {

                    if(element.id==highlight){
                        renderHighlight(element.id);
                    }
                });
            });
        });
        const col1 = `${String.fromCharCode(curr_posi[0].charCodeAt(0) - 1)}
        ${Number(curr_posi[1]) + 1}`;

        const col2 = `${String.fromCharCode(curr_posi[0].charCodeAt(0) + 1)}
        ${Number(curr_posi[1]) + 1}`;

        checkOpponentPiece(col1,"white");
        checkOpponentPiece(col2,"white");
      //  globalStateRender();
    }else{
        const col1 = `${String.fromCharCode(curr_posi[0].charCodeAt(0) - 1)}
        ${Number(curr_posi[1]) + 1}`;

        const col2 = `${String.fromCharCode(curr_posi[0].charCodeAt(0) + 1)}
        ${Number(curr_posi[1]) + 1}`;

        // console.log(col1,col2);
        checkOpponentPiece(col1,"white");
        checkOpponentPiece(col2,"white");

        const captureIds=[col1,col2];

        const highlightSqrIds=[
            `${curr_posi[0]}${Number(curr_posi[1])+1}`,
        ];
        // captureIds.forEach(element => {
        //     checkOpponentPiece(element,"white");
        // });
        renderHighlight(highlightSqrIds);
        // clearHighlight();
    }
}
function blackPawnClicked({piece}){
    
    if(highlightState){
        //move_piece_from_x_to_y(selfhighlight,piece);
        moveElement(highlightState,piece);
        return;
    }
    if (selfhighlight === piece) {
        clearHighlight();
        clearPrevSelfHlt(selfhighlight);
        selfhighlight=null;
        moveState=null;
        return;
    }
    clearPrevSelfHlt(selfhighlight);
    clearHighlight();
    selfhlts(piece);

    selfhighlight=piece;

    moveState=piece;

    const curr_posi=piece.curr_pos;

    if(curr_posi[1]=="7"){
        const hltsSqrIds=[
            `${curr_posi[0]}${Number(curr_posi[1]) - 1}`,
            `${curr_posi[0]}${Number(curr_posi[1]) - 2}`,
        ];

        hltsSqrIds.forEach((highlight) => {

            globalData.forEach((row) => {
                row.forEach((element) => {

                    if(element.id==highlight){
                        renderHighlight(element.id);
                    }
                });
            });
        });
        const col1 = `${String.fromCharCode(curr_posi[0].charCodeAt(0) - 1)}
        ${Number(curr_posi[1]) - 1}`;
        const col2 = `${String.fromCharCode(curr_posi[0].charCodeAt(0) + 1)}
        ${Number(curr_posi[1]) - 1}`;

        checkOpponentPiece(col1,black);
        checkOpponentPiece(col2,black);

    } else{
        const col1 = `${String.fromCharCode(curr_posi[0].charCodeAt(0) - 1)}
        ${Number(curr_posi[1]) - 1}`;

        const col2 = `${String.fromCharCode(curr_posi[0].charCodeAt(0) + 1)}
        ${Number(curr_posi[1]) - 1}`;

        // console.log(col1,col2);
        checkOpponentPiece(col1,black);
        checkOpponentPiece(col2,black);

        const highlightSqrIds=[
            `${curr_posi[0]}${Number(curr_posi[1])+1}`,
        ];
        renderHighlight(highlightSqrIds);
    }
}
function GlobalEvent(){
    ROOT_DIV.addEventListener("click",function(event){
        if(event.target.localName==="img"){
            const clickId=event.target.parentNode.id;

            const flatArray=globalData.flat();
            //searching
            const square=flatArray.find((el)=>el.id==clickId);

            if(moveState && square.captureHighlight){
                moveElement(moveState, clickId);
                moveState = null;
                clearPrevSelfHlt(selfhighlight);
                selfhighlight = null;
                return;
            }
            if(!square.piece) return;
            if(square.piece.piece_name==="White_Pawn"){
                whitePawnClicked(square);
            }
            else if(square.piece.piece_name==="Black_Pawn") {
                blackPawnClicked(square);
            }
        }else{
            const childElementOfclickedEl=Array.from(event.target.childNodes);
            if(moveState && (childElementOfclickedEl.length<=2 || 
                event.target.localName=="span"
            )){
                if(event.target.localName=="span"){
                    const id=event.target.parentNode.id;
                    moveElement(moveState,id);
                    moveState=null;

                    clearPrevSelfHlt(selfhighlight);
                    selfhighlight=null;
                }
                else{
                    const id=event.target.id;
                    moveElement(moveState,id);
                    moveState=null;

                    clearPrevSelfHlt(selfhighlight);
                    selfhighlight=null;
                }
                
            }else{
                clearHighlight();
                clearPrevSelfHlt(selfhighlight);
            }
            
        }
    })
}
export {GlobalEvent};