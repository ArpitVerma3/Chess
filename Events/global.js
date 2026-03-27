import { ROOT_DIV } from "../Helper/constants.js";
import { globalData } from "../index.js";
import { renderHighlight } from "../Render/main.js";
import { clearHighlight,moveElement } from "../Render/main.js";
import { selfhlts,clearPrevSelfHlt } from "../Render/main.js";

let selfhighlight=null;
//move state
let moveState=null;

function whitePawnClicked({piece}){
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
                        element.highlightSqr(true);
                    }
                });
            });
        });
    }
}
function GlobalEvent(){
    ROOT_DIV.addEventListener("click",function(event){
        if(event.target.localName==="img"){
            const clickId=event.target.parentNode.id;

            const flatArray=globalData.flat();
            //searching
            const square=flatArray.find((el)=>el.id==clickId);

            if(square.piece.piece_name==="White_Pawn"){
                whitePawnClicked(square);
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