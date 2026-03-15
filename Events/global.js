import { ROOT_DIV } from "../Helper/constants.js";
import { globalData } from "../index.js";
import { renderHighlight } from "../Render/main.js";
import { highlight_state } from "../Helper/constants.js";

let highlight_state=false;
function whitePawnClicked({piece}){
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
                        element.highlight=true;
                    }
                });
            });
            if(highlight_state)clearHighlight();
            renderHighlight(highlight);
            highlight_state=true;
        });
    }
    console.log(globalData);  
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