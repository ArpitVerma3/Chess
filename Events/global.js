import { ROOT_DIV } from "../Helper/constants.js";
import { globalData } from "../index.js";
import { renderHighlight } from "../Render/main.js";
import { clearHighlight } from "../Render/main.js";

function whitePawnClicked({piece}){
    const curr_posi=piece.curr_pos;

    if(curr_posi[1]=="2"){
        const hltsSqrIds=[
            `${curr_posi[0]}${Number(curr_posi[1]) + 1}`,
            `${curr_posi[0]}${Number(curr_posi[1]) + 2}`,
        ];
        clearHighlight();

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
            
        }
    })
}
export {GlobalEvent};